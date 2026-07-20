import crypto from 'crypto';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import { Auction } from '../models/auction.model.js';
import { Bid } from '../models/bid.model.js';
import { Payment } from '../models/payment.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { getIO } from '../socket.js';

const getRazorpay=()=>{
    if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET) throw new ApiError(500,'Razorpay is not configured');
    return new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
};

const createPaymentOrder=asyncHandler(async(req,res)=>{
    const {auctionId}=req.body;
    if(!mongoose.isValidObjectId(auctionId)) throw new ApiError(400,'Invalid auction id');
    const auction=await Auction.findById(auctionId).lean();
    if(!auction) throw new ApiError(404,'Auction not found');
    if(new Date(auction.endDate)>new Date()&&auction.status!=='Completed') throw new ApiError(409,'Payment is available only after the auction ends');
    if(auction.status==='Cancelled') throw new ApiError(409,'Cancelled auctions cannot be paid');

    const winningBid=await Bid.findOne({auction:auctionId}).sort({amount:-1,createdAt:1}).lean();
    if(!winningBid) throw new ApiError(409,'This auction has no winning bid');
    if(String(winningBid.owner)!==String(req.user._id)) throw new ApiError(403,'Only the winning bidder can pay');

    const existingPayment=await Payment.findOne({auction:auctionId});
    if(existingPayment?.status==='Paid') throw new ApiError(409,'This auction has already been paid');

    const totalAmount=Math.round(winningBid.amount*100);
    const order=await getRazorpay().orders.create({
        amount:totalAmount,
        currency:'INR',
        receipt:`auction_${String(auctionId).slice(-16)}`,
        partial_payment:false,
        notes:{auctionId:String(auctionId),payerId:String(req.user._id),sellerId:String(auction.seller)}
    });

    await Payment.findOneAndUpdate(
        {auction:auctionId},
        {payer:req.user._id,seller:auction.seller,amount:winningBid.amount,currency:'inr',status:'Pending',razorpayOrderId:order.id},
        {upsert:true,new:true,setDefaultsOnInsert:true}
    );
    return res.status(201).json(new ApiResponse(201,{keyId:process.env.RAZORPAY_KEY_ID,orderId:order.id,amount:totalAmount,currency:'INR',productName:auction.productName,customer:{name:req.user.fullname,email:req.user.email}},'Razorpay order created'));
});

const markPaymentPaid=async(payment,razorpayPaymentId)=>{
    if(!payment||payment.status==='Paid') return payment;
    const updated=await Payment.findByIdAndUpdate(payment._id,{status:'Paid',razorpayPaymentId,paidAt:new Date()},{new:true});
    const update={auctionId:String(updated.auction),paymentStatus:'Paid',paidAt:updated.paidAt};
    getIO().to(`auction:${updated.auction}`).emit('payment:completed',update);
    getIO().emit('auction:payment-updated',update);
    return updated;
};

const verifyPayment=asyncHandler(async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    const payment=await Payment.findOne({razorpayOrderId:razorpay_order_id,payer:req.user._id});
    if(!payment) throw new ApiError(404,'Payment order not found');
    const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${payment.razorpayOrderId}|${razorpay_payment_id}`).digest('hex');
    const received=String(razorpay_signature||'');
    if(expected.length!==received.length||!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(received))) throw new ApiError(400,'Invalid Razorpay payment signature');
    const remotePayment=await getRazorpay().payments.fetch(razorpay_payment_id);
    if(remotePayment.order_id!==payment.razorpayOrderId) throw new ApiError(400,'Payment does not match this order');
    if(remotePayment.status==='captured') await markPaymentPaid(payment,razorpay_payment_id);
    return res.status(200).json(new ApiResponse(200,{paymentStatus:remotePayment.status==='captured'?'Paid':'Pending'},'Payment verified'));
});

const razorpayWebhook=async(req,res)=>{
    try{
        if(!process.env.RAZORPAY_WEBHOOK_SECRET) return res.status(500).send('Razorpay webhook is not configured');
        const received=String(req.headers['x-razorpay-signature']||'');
        const expected=crypto.createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(req.body).digest('hex');
        if(received.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(received),Buffer.from(expected))) return res.status(400).send('Invalid webhook signature');
        const event=JSON.parse(req.body.toString('utf8'));
        if(event.event==='order.paid'||event.event==='payment.captured'){
            const orderId=event.payload?.order?.entity?.id||event.payload?.payment?.entity?.order_id;
            const paymentId=event.payload?.payment?.entity?.id;
            if(orderId) await markPaymentPaid(await Payment.findOne({razorpayOrderId:orderId}),paymentId);
        }
        return res.json({received:true});
    }catch(error){
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

export {createPaymentOrder,verifyPayment,razorpayWebhook};
