import { asyncHandler } from "../utils/AsyncHandler";

const registerAuction=asyncHandler(async(req,res)=>{
    const{productName,category,condition,auctionEndDate,description,images}=req.body;
    
})