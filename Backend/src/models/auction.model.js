import mongoose from "mongoose";
const auctionSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['Mobiles','Laptops','Faishon','Furniture','Accessories','Others']
    },
    images:{
        type:[String],
        validate:function(v){
            return v.length()>=2&&v.length()<=5;
        }
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    startingPrice: { 
        type: Number, 
        required: true 
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['Cancelled','Open','Completed']
    },
    condition:{
        type:String,
        enum:['Brand New','Like New','Excellent','Good','Fair']
    },
    description:{
        type:String
    }
},{timestamps:true})
export const Auction=mongoose.model('Auction',auctionSchema);