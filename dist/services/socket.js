"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIO = void 0;
const socket_io_1 = require("socket.io");
const messages_1 = require("../models/messages");
class SocketIO {
    constructor() {
        this._io = new socket_io_1.Server({ cors: {
                origin: process.env.CLIENT_URL,
                credentials: true,
                allowedHeaders: ["userid"]
            } });
        this.userIdAndSocketIdTable = new Map();
    }
    get io() {
        return this._io;
    }
    ;
    initSocketService() {
        const io = this._io;
        io.on("connect", (socket) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = socket.handshake.headers["userid"]) === null || _a === void 0 ? void 0 : _a.toString();
            this.userIdAndSocketIdTable.set(userId, socket.id);
            console.log(this.userIdAndSocketIdTable);
            // socket.on("NEW_MESSAGE",async(data)=>{
            //     await pub.publish("messages",JSON.stringify(data))
            // })    
            socket.on("NEW_MESSAGE", (newMessage) => __awaiter(this, void 0, void 0, function* () {
                // keeping down kafak services 
                // await produceMessage({
                //     chatId:newMessage.chatId,
                //     from:newMessage.from,
                //     to:newMessage.to,
                //     message:newMessage.message
                // })
                const getRecvier = this.userIdAndSocketIdTable.get(newMessage.to);
                io.to([socket.id, getRecvier]).emit("NEW_MESSAGE", newMessage);
                try {
                    if (!newMessage.message)
                        return;
                    yield messages_1.Messages.create({
                        chatId: newMessage.chatId,
                        message: newMessage.message,
                        to: newMessage.to,
                        from: newMessage.from
                    });
                }
                catch (error) {
                    console.log(true);
                }
            }));
            socket.on("REQUEST_ACCEPTED", (data) => {
                console.log(data, "me hi hu");
                let reciver = this.userIdAndSocketIdTable.get(data);
                io.to(reciver).emit("REQUEST_ACCEPTED_DONE", "DONE");
            });
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
            socket.on("outgoing:call", (data) => {
                const { offer, to } = data;
                let reciverSocketId = this.userIdAndSocketIdTable.get(to);
                io.to(reciverSocketId).emit("incoming:call", { offer, from: userId });
            });
            socket.on('call:accepted', (data) => {
                const { answere, to } = data;
                let reciverSocketId = this.userIdAndSocketIdTable.get(to);
                socket.to(reciverSocketId).emit('incomming:answere', { from: userId, offer: answere });
            });
            socket.on('disconnect', () => {
                this.userIdAndSocketIdTable.delete(userId);
            });
        }));
    }
}
exports.SocketIO = SocketIO;
