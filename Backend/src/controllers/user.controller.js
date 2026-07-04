import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import mongoose,{mongo} from "mongoose";
const registerUser=asyncHandler(
    async (req,res)=>{
        const {email,fullname, password}=req.body;
        if([fullname,email,password].some((field)=>field?.trim()=="")){
            throw new ApiError(400,'All fields are compulsory')
        }
        const existedEmail=await User.findOne({
            email:email
        })
        if(existedEmail){
            throw new ApiError(409,'Email already registered')
        }
        const user=await User.create({
            fullname,
            email,
            password
        })
        const createdUser=await User.findById(user._id).select('-password -refreshToken')
        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registeration")
        }
        return res.status(200).json(new ApiResponse(200,createdUser,'User Created Successfully'));
    }
)
export {registerUser}