import { Server } from 'socket.io';

let io;

const initializeSocket=(httpServer)=>{
    io=new Server(httpServer,{
        cors:{
            origin:process.env.CORS_ORIGIN,
            credentials:true
        }
    });

    io.on('connection',(socket)=>{
        socket.on('auction:join',(auctionId)=>{
            if(typeof auctionId==='string'&&auctionId){
                socket.join(`auction:${auctionId}`);
            }
        });

        socket.on('auction:leave',(auctionId)=>{
            if(typeof auctionId==='string'&&auctionId){
                socket.leave(`auction:${auctionId}`);
            }
        });
    });

    return io;
}

const getIO=()=>{
    if(!io) throw new Error('Socket.IO has not been initialized');
    return io;
}

export {initializeSocket,getIO};
