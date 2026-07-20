import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from 'http';
import { initializeSocket } from './socket.js';
// const app=express()
const httpServer=createServer(app);
initializeSocket(httpServer);

connectDB().then(()=>{
    const port=process.env.PORT||8000;
    httpServer.listen(port,()=>{
        console.log(`Server is running at port ${port}`)
    });
}).catch(()=>{
    console.log('MONGODB connection failed')
});
