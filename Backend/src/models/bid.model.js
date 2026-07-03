import mongoose from "mongoose";
const bidSchema=new mongoose.Schema({

},{timestamps:true})
export const Bid=mongoose.model('Bid',bidSchema)
