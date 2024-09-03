import express from "express";
import { getChatDetail, getChatlists, getChatMessages } from "../controller/chats";

const chat=express.Router();

chat.get("/allchats",getChatlists)
chat.get("/chatdetails",getChatDetail)
chat.get("/messages",getChatMessages)


export default chat
