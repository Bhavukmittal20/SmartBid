import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import mongoose,{mongo} from "mongoose";
const generateAccessandRefreshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    }catch(error){
        throw new ApiError(500,`An error occured while generating tokens:${error}`)
    }
}
const registerUser=asyncHandler(
    async (req,res)=>{
        console.log('Request AAgayi balle balle')
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
const loginUser=asyncHandler(
    async (req,res)=>{
        const {email,password}=req.body;
        if(!email||!password) throw new ApiError(400,'Both password and emails are necessary')
        const user=await User.findOne({email})
    if(!user) throw new ApiError(404,'User email not found')
        const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid)
        throw new ApiError(404,'Invalid Credentials')
    const {accessToken,refreshToken}=await generateAccessandRefreshTokens(user._id)
    const loggedInUser= await User.findById(user._id).select('-password -refreshToken')
    const options={
        httpOnly:true,
        secure:false
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(
        200,{
            user:loggedInUser,
            accessToken,refreshToken
        },
        'User Logged In Successfully'
    ))
    }
)
const refreshAccessToken=asyncHandler(
    async (req,res)=>{
try {
            const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
            if(!incomingRefreshToken) throw new ApiError(401,"Unauthorized Request")
            const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        
            const user=await User.findById(decodedToken?._id)
            if(!user) throw new ApiError(401,"Invalid Refresh Token")
            if(incomingRefreshToken!=user?.refreshToken) throw new ApiError(401,"Refresh Token is expired or used")
            const options={
            httpOnly:true,
            secure:false
            }
            const {accessToken,refreshToken}= await generateAccessandRefreshTokens(user._id)
            return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken},"Access Token Refreshed"))
} catch (error) {
    throw new ApiError(401,error?.message||"Invalid Refresh Token")
}
    }
)
const fetchUser=asyncHandler(
    async(req,res)=>{
        if(!req.user) throw new ApiError(404,'User Not Found')
        return res.status(200).json(new ApiResponse(200,{
            user:req.user
        },'User details fetched successfully'))

    }
)
export {registerUser,loginUser,refreshAccessToken,fetchUser}
