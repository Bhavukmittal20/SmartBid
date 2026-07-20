import mongoose from 'mongoose';
import { Auction } from '../models/auction.model.js';
import { Bid } from '../models/bid.model.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { getIO } from '../socket.js';

const placeBid=asyncHandler(async(req,res)=>{
    const {auctionId,amount}=req.body;
    const userId=req.user?._id;
    const bidAmount=Number(amount);

    if(!mongoose.isValidObjectId(auctionId)) throw new ApiError(400,'Invalid auction id');
    if(!Number.isFinite(bidAmount)||bidAmount<=0) throw new ApiError(400,'Enter a valid bid amount');

    const auction=await Auction.findById(auctionId);
    if(!auction) throw new ApiError(404,'Auction not found');
    if(String(auction.seller)===String(userId)) throw new ApiError(403,'You cannot bid on your own auction');
    if(auction.status!=='Open'||new Date(auction.endDate)<=new Date()) throw new ApiError(409,'This auction is no longer accepting bids');

    const highestBid=await Bid.findOne({auction:auctionId}).sort({amount:-1});
    const currentBid=highestBid?.amount??auction.startingPrice;
    if(bidAmount<=currentBid) throw new ApiError(409,`Bid must be greater than ${currentBid}`);

    const newBid=await Bid.create({auction:auctionId,owner:userId,amount:bidAmount});
    await User.findByIdAndUpdate(userId,{$addToSet:{bidHistory:newBid._id}});
    const populatedBid=await Bid.findById(newBid._id).populate('owner','fullname').lean();
    const bidCount=await Bid.countDocuments({auction:auctionId});
    const update={auctionId:String(auctionId),bid:populatedBid,currentBid:bidAmount,bidCount};

    const io=getIO();
    io.to(`auction:${auctionId}`).emit('bid:placed',update);
    io.emit('auction:updated',update);

    return res.status(201).json(new ApiResponse(201,update,'Bid placed successfully'));
});

const getMyBidStats=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const [totalBids,auctionIds]=await Promise.all([
        Bid.countDocuments({owner:userId}),
        Bid.distinct('auction',{owner:userId})
    ]);
    const activeBids=await Auction.countDocuments({
        _id:{$in:auctionIds},
        status:'Open',
        endDate:{$gt:new Date()}
    });

    return res.status(200).json(new ApiResponse(200,{totalBids,activeBids},'Bid statistics fetched successfully'));
});

export {placeBid,getMyBidStats};
