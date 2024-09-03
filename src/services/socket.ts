import { Server } from "socket.io";
import { pub, sub } from "./redis";
import { produceMessage } from "./kafka";
import { Messages } from "../models/messages";

interface MessageType {
    chatId:string,
    message:string,
    to:string,
    from:string,
    date:number
}

export class SocketIO{
    public _io:Server;
    private userIdAndSocketIdTable;

    constructor(){
        this._io= new Server(       
        {cors:{
            origin:"http://localhost:3000",
            credentials:true,
            allowedHeaders:["userid"]
        }});
        this.userIdAndSocketIdTable=new Map();
        //  sub.subscribe("messages")
    }

    get io(){
        return this._io
    };

      initSocketService(){
        const io =this._io;

        io.on("connect",async(socket)=>{
            const userId=socket.handshake.headers["userid"]?.toString();
                this.userIdAndSocketIdTable.set(userId,socket.id)
                
                console.log(this.userIdAndSocketIdTable)

            // socket.on("NEW_MESSAGE",async(data)=>{
                
            //     await pub.publish("messages",JSON.stringify(data))
            // })    


            socket.on("NEW_MESSAGE",async(newMessage:MessageType)=>{
                // keeping down kafak services 

                // await produceMessage({
                //     chatId:newMessage.chatId,
                //     from:newMessage.from,
                //     to:newMessage.to,
                //     message:newMessage.message
                // })
                
                const getRecvier=this.userIdAndSocketIdTable.get(newMessage.to)
                io.to([socket.id,getRecvier]).emit("NEW_MESSAGE",newMessage)
                try {
                    if(!newMessage.message) return ;
                    await Messages.create({
                        chatId:newMessage.chatId,
                        message:newMessage.message,
                        to:newMessage.to,
                        from:newMessage.from
                    })
                   }catch(error){
                    console.log(true)
                   }
            })


            // facing issue from redis

            //  sub.on("message",async(channel,messages)=>{
            //     if(channel==="messages"){
            //         const newMessage=JSON.parse(messages) as {chatId:string, message:string, to:string, from:string, date:number};

            //         await produceMessage({
            //             chatId:newMessage.chatId,
            //             from:newMessage.from,
            //             to:newMessage.to,
            //             message:newMessage.message
            //         })
            //         const getRecvier=this.userIdAndSocketIdTable.get(newMessage.to);
            //         io.to([socket.id,getRecvier]).emit("NEW_MESSAGE",newMessage);
            //     }
            //  })
                

            // handling calling systems

            socket.on("outgoing:call",(data)=>{
                const {offer,to}=data;
                let reciverSocketId = this.userIdAndSocketIdTable.get(to)
                io.to(reciverSocketId).emit("incoming:call",{offer,from:userId})
            })
    
            socket.on('call:accepted', (data) => {
                const { answere, to } = data;
                let reciverSocketId = this.userIdAndSocketIdTable.get(to)
                socket.to(reciverSocketId).emit('incomming:answere', { from: userId, offer: answere })
           });


            socket.on('disconnect', () => {
                this.userIdAndSocketIdTable.delete(userId);
            });
           
        })
    }
}