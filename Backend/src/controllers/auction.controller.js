import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getIO } from "../socket.js";
import { Payment } from "../models/payment.model.js";

const registerAuction=asyncHandler(async(req,res)=>{
    const{productName,category,condition,auctionEndDate,description,startingPrice}=req.body;
    if([productName,category,condition,auctionEndDate,startingPrice].some((field)=>field?.trim()=="")){
        throw new ApiError(400,'All fields are compulsory')
    }
    const files=req.files
    if(!files||files.length<2||files.length>5){
        throw new ApiError(400,'At least 2 and at most 5 images are required')
    }
    const photoLocalPaths=files.map((file)=>file.path);
    var photoUrls=[]
    for(let i=0;i<photoLocalPaths.length;i++){
        const currUrl=await uploadOnCloudinary(photoLocalPaths[i])
        if(!currUrl){
            throw new ApiError(400,"Photo File is required");
        }
        photoUrls.push(currUrl);
    }
    const formatStartPrice=Number(startingPrice)
    
    if(!startingPrice){
        throw new ApiError(400,'starting priice should be positive')
    }
    const auction=await Auction.create({
        productName,
        category,
        condition,
        description,
        images:photoUrls,
        seller:req.user._id,
        startingPrice:Number(startingPrice),
        endDate: new Date(auctionEndDate)
    })
    const createdAuction=await Auction.findById(auction._id).populate('seller','fullname').lean();
    const auctionDetails={...createdAuction,currentBid:createdAuction.startingPrice,bidCount:0};
    getIO().emit('auction:created',auctionDetails);
    return res.status(201).json(new ApiResponse(201,{
        auction:auctionDetails
    }))
})
const getAuctionDetails=asyncHandler(async(req,res)=>{
    const {auctionId}=req.params;

    if(!mongoose.isValidObjectId(auctionId)){
        throw new ApiError(400,'Invalid auction id')
    }

    const auction=await Auction.findById(auctionId)
        .populate('seller','fullname')
        .lean();

    if(!auction) throw new ApiError(404,'Auction Not Found')

    const bids=await Bid.find({auction:auctionId})
        .sort({amount:-1,createdAt:1})
        .populate('owner','fullname')
        .lean();
    const payment=await Payment.findOne({auction:auctionId}).select('status paidAt').lean();

    const hasEnded=auction.status==='Completed'||new Date(auction.endDate)<=new Date();
    const highestBid=bids[0]||null;
    const auctionDetails={
        ...auction,
        status:hasEnded&&auction.status==='Open'?'Completed':auction.status,
        bids,
        currentBid:highestBid?.amount??auction.startingPrice,
        winner:hasEnded?highestBid?.owner??null:null,
        paymentStatus:payment?.status??'Unpaid',
        paidAt:payment?.paidAt??null
    };

    return res.status(200).json(new ApiResponse(200,{
        auction:auctionDetails
    }))
})
const getAuctions=asyncHandler(async(req,res)=>{
    const auctions=await Auction.find({status:{$ne:'Cancelled'}}).sort({createdAt:-1}).populate('seller','fullname').lean();
    const auctionIds=auctions.map((auction)=>auction._id);
    const summaries=await Bid.aggregate([
        {$match:{auction:{$in:auctionIds}}},
        {$group:{_id:'$auction',currentBid:{$max:'$amount'},bidCount:{$sum:1}}}
    ]);
    const summaryById=new Map(summaries.map((summary)=>[String(summary._id),summary]));
    const now=new Date();
    const auctionList=auctions.map((auction)=>{
        const summary=summaryById.get(String(auction._id));
        return {...auction,status:auction.status==='Open'&&new Date(auction.endDate)<=now?'Completed':auction.status,currentBid:summary?.currentBid??auction.startingPrice,bidCount:summary?.bidCount??0};
    });
    return res.status(200).json(new ApiResponse(200,{auctions:auctionList}));
})
export {registerAuction,getAuctionDetails,getAuctions}
