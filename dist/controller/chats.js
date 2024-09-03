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
exports.getChatMessages = exports.getChatDetail = exports.getChatlists = void 0;
const ErrorHandlers_1 = require("../middleware/ErrorHandlers");
const chats_1 = require("../models/chats");
const messages_1 = require("../models/messages");
const sendCookies_1 = require("../utils/sendCookies");
exports.getChatlists = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, sendCookies_1.verifyToken)(req.cookies["_id"]);
    const chats = yield chats_1.Chat.find({ members: id }).populate("members", "name avatar");
    res.status(201).json({
        success: true,
        message: chats
    });
}));
exports.getChatDetail = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.query;
    const chat = yield chats_1.Chat.findById(chatId).populate("members", "name avatar ");
    res.status(200).json({
        success: true,
        message: chat
    });
}));
exports.getChatMessages = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const getMessage = yield messages_1.Messages.find({ chatId: id });
    res.status(200).json({
        success: true,
        messages: getMessage
    });
}));
