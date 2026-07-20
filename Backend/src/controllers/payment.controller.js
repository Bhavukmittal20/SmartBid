import Stripe from 'stripe';
import mongoose from 'mongoose';
import { Auction } from '../models/auction.model.js';
import { Bid } from '../models/bid.model.js';
import { Payment } from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { getIO } from '../socket.js';

const getStripe=()=>{
    if(!process.env.STRIPE_SECRET_KEY) throw new ApiError(500,'Stripe is not configured');
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const frontendUrl=()=> (process.env.FRONTEND_URL||process.env.CORS_ORIGIN||'http://localhost:5173').replace(/\/$/,'');

const getConnectStatus=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select('+stripeAccountId');
    if(!user?.stripeAccountId){
        return res.status(200).json(new ApiResponse(200,{connected:false,detailsSubmitted:false,chargesEnabled:false,payoutsEnabled:false}));
    }
    const account=await getStripe().accounts.retrieve(user.stripeAccountId);
    return res.status(200).json(new ApiResponse(200,{
        connected:true,
        detailsSubmitted:account.details_submitted,
        chargesEnabled:account.charges_enabled,
        payoutsEnabled:account.payouts_enabled
    }));
});

const createConnectAccountLink=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select('+stripeAccountId');
    let accountId=user.stripeAccountId;
    const stripe=getStripe();

    if(!accountId){
        const account=await stripe.accounts.create({
            type:'express',
            email:user.email,
            business_profile:{product_description:'Seller on the SmartBid auction marketplace'},
            metadata:{userId:String(user._id)}
        });
        accountId=account.id;
        user.stripeAccountId=accountId;
        await user.save({validateBeforeSave:false});
    }

    const returnPath=typeof req.body.returnPath==='string'&&req.body.returnPath.startsWith('/')?req.body.returnPath:'/dashboard';
    const link=await stripe.accountLinks.create({
        account:accountId,
        refresh_url:`${frontendUrl()}${returnPath}?connect=refresh`,
        return_url:`${frontendUrl()}${returnPath}?connect=returned`,
        type:'account_onboarding'
    });

    return res.status(200).json(new ApiResponse(200,{url:link.url},'Seller onboarding link created'));
});

const createExpressDashboardLink=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select('+stripeAccountId');
    if(!user?.stripeAccountId) throw new ApiError(409,'Complete seller onboarding first');
    const link=await getStripe().accounts.createLoginLink(user.stripeAccountId);
    return res.status(200).json(new ApiResponse(200,{url:link.url}));
});

const createCheckoutSession=asyncHandler(async(req,res)=>{
    const {auctionId}=req.body;
    if(!mongoose.isValidObjectId(auctionId)) throw new ApiError(400,'Invalid auction id');

    const auction=await Auction.findById(auctionId).lean();
    if(!auction) throw new ApiError(404,'Auction not found');
    if(new Date(auction.endDate)>new Date()&&auction.status!=='Completed') throw new ApiError(409,'Payment is available only after the auction ends');
    if(auction.status==='Cancelled') throw new ApiError(409,'Cancelled auctions cannot be paid');

    const winningBid=await Bid.findOne({auction:auctionId}).sort({amount:-1,createdAt:1}).lean();
    if(!winningBid) throw new ApiError(409,'This auction has no winning bid');
    if(String(winningBid.owner)!==String(req.user._id)) throw new ApiError(403,'Only the winning bidder can pay');

    const seller=await User.findById(auction.seller).select('+stripeAccountId');
    if(!seller?.stripeAccountId) throw new ApiError(409,'The seller has not connected a payout account yet');
    const connectedAccount=await getStripe().accounts.retrieve(seller.stripeAccountId);
    if(!connectedAccount.details_submitted||!connectedAccount.charges_enabled||!connectedAccount.payouts_enabled){
        throw new ApiError(409,'The seller must complete Stripe onboarding before payment');
    }

    const existingPayment=await Payment.findOne({auction:auctionId});
    if(existingPayment?.status==='Paid') throw new ApiError(409,'This auction has already been paid');

    const stripe=getStripe();
    const feePercent=Math.min(Math.max(Number(process.env.STRIPE_PLATFORM_FEE_PERCENT)||0,0),100);
    const platformFeeAmount=Math.round(winningBid.amount*100*(feePercent/100));
    const paymentIntentData={
        transfer_data:{destination:seller.stripeAccountId},
        metadata:{auctionId:String(auctionId),payerId:String(req.user._id),sellerId:String(seller._id)}
    };
    if(platformFeeAmount>0) paymentIntentData.application_fee_amount=platformFeeAmount;
    const session=await stripe.checkout.sessions.create({
        mode:'payment',
        customer_email:req.user.email,
        client_reference_id:String(auctionId),
        line_items:[{
            quantity:1,
            price_data:{
                currency:'inr',
                unit_amount:Math.round(winningBid.amount*100),
                product_data:{
                    name:auction.productName,
                    description:`Winning bid for auction ${auctionId}`,
                    images:auction.images?.[0]?[auction.images[0]]:undefined
                }
            }
        }],
        metadata:{auctionId:String(auctionId),payerId:String(req.user._id),sellerId:String(seller._id)},
        payment_intent_data:paymentIntentData,
        success_url:`${frontendUrl()}/auction/${auctionId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${frontendUrl()}/auction/${auctionId}?payment=cancelled`
    });

    await Payment.findOneAndUpdate(
        {auction:auctionId},
        {payer:req.user._id,seller:seller._id,amount:winningBid.amount,currency:'inr',status:'Pending',stripeCheckoutSessionId:session.id,stripeDestinationAccountId:seller.stripeAccountId,platformFeeAmount:platformFeeAmount/100},
        {upsert:true,new:true,setDefaultsOnInsert:true}
    );

    return res.status(201).json(new ApiResponse(201,{url:session.url,sessionId:session.id},'Checkout session created'));
});

const stripeWebhook=async(req,res)=>{
    try{
        if(!process.env.STRIPE_WEBHOOK_SECRET) return res.status(500).send('Stripe webhook is not configured');
        const event=getStripe().webhooks.constructEvent(req.body,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);

        if(event.type==='checkout.session.completed'){
            const session=event.data.object;
            if(session.payment_status==='paid'&&session.metadata?.auctionId&&session.metadata?.payerId){
                const payment=await Payment.findOneAndUpdate(
                    {auction:session.metadata.auctionId,payer:session.metadata.payerId},
                    {status:'Paid',stripeCheckoutSessionId:session.id,stripePaymentIntentId:session.payment_intent,paidAt:new Date()},
                    {new:true}
                );
                if(payment){
                    const update={auctionId:String(payment.auction),paymentStatus:'Paid',paidAt:payment.paidAt};
                    getIO().to(`auction:${payment.auction}`).emit('payment:completed',update);
                    getIO().emit('auction:payment-updated',update);
                }
            }
        }

        return res.json({received:true});
    }catch(error){
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

export {createCheckoutSession,stripeWebhook,getConnectStatus,createConnectAccountLink,createExpressDashboardLink};
