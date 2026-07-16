import { Auction } from "../models/auction.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    const createdAuction=await Auction.findById(auction._id);
    return res.status(201).json(new ApiResponse(201,{
        auction:createdAuction
    }))
})
export {registerAuction}