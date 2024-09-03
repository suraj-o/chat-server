"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chats_1 = require("../controller/chats");
const chat = express_1.default.Router();
chat.get("/allchats", chats_1.getChatlists);
chat.get("/chatdetails", chats_1.getChatDetail);
chat.get("/messages", chats_1.getChatMessages);
exports.default = chat;
