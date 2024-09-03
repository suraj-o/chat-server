import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/ErrorHandlers";
import { Chat } from "../models/chats";
import { Messages } from "../models/messages";
import { verifyToken } from "../utils/sendCookies";



export const getChatlists=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const id =verifyToken(req.cookies["_id"])

    const chats=await Chat.find({members:id}).populate("members","name avatar")

    res.status(201).json({
        success:true,
        message:chats
    })
})

export const getChatDetail=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {chatId}=req.query;

    const chat=await Chat.findById(chatId).populate("members","name avatar ");

    res.status(200).json({
        success:true,
        message:chat
    })
})



export const getChatMessages=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.query;
    const getMessage=await Messages.find({chatId:id});

    res.status(200).json({
        success:true,
        messages:getMessage
    })
})


