import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express()
import { razorpayWebhook } from './controllers/payment.controller.js'
app.post('/api/v1/payments/webhook',express.raw({type:'application/json'}),razorpayWebhook)
app.use(cors({
            origin:process.env.CORS_ORIGIN,
            credentials:true
        }))
app.use(express.json({limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())
import userRouter from './routes/userRouter.js'
import auctionRouter from './routes/auctionRouter.js'
import bidRouter from './routes/bidRouter.js'
import paymentRouter from './routes/paymentRouter.js'
app.use('/api/v1/users',userRouter)
app.use('/api/v1/auctions',auctionRouter)
app.use('/api/v1/bids',bidRouter)
app.use('/api/v1/payments',paymentRouter)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});
export {app};
