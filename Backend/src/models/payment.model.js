import mongoose from 'mongoose';

const paymentSchema=new mongoose.Schema({
    auction:{type:mongoose.Schema.Types.ObjectId,ref:'Auction',required:true,unique:true},
    payer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    seller:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    amount:{type:Number,required:true},
    currency:{type:String,default:'inr'},
    status:{type:String,enum:['Pending','Paid','Failed'],default:'Pending'},
    stripeCheckoutSessionId:{type:String},
    stripePaymentIntentId:{type:String},
    stripeDestinationAccountId:{type:String},
    platformFeeAmount:{type:Number,default:0},
    paidAt:{type:Date}
},{timestamps:true});

export const Payment=mongoose.model('Payment',paymentSchema);
