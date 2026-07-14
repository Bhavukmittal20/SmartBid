import mongoose from "mongoose";
const bidSchema=new mongoose.Schema({
    auction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    amount:{
        type:Number,
        required:true
    }
},{timestamps:true})
export const Bid=mongoose.model('Bid',bidSchema)
