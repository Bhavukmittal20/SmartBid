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
        validate:{
            validator:function(v){
                return v.length>=2&&v.length<=5;
            },
            message:'At least 2 and at most 5 images are required'
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
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['Cancelled','Open','Completed'],
        default:'Open'
    },
    condition:{
        type:String,
        enum:['Brand New','Like New','Excellent','Good','Fair'],
        required:true
    },
    description:{
        type:String
    }
},{timestamps:true})
export const Auction=mongoose.model('Auction',auctionSchema);
