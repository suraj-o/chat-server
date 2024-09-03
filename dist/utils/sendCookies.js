"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.sendCookies = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendCookies = (req, id, res, message, status, next) => {
    if (req.cookies["_id"]) {
        return res.status(400).json({
            success: false,
            message: "you are already logged in"
        });
    }
    ;
    const token = jsonwebtoken_1.default.sign({ _id: id }, process.env.JWT_SECRET);
    const cookieOption = {};
    return res.cookie("_id", token, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "none"
    }).status(status).json({
        success: true,
        message,
        _id: id.toString()
    });
};
exports.sendCookies = sendCookies;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
