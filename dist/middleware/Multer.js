"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const stroage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        let id = (0, uuid_1.v4)();
        const extname = file.originalname.split(".").pop();
        callback(null, `${id}.${extname}`);
    }
});
exports.singleUpload = (0, multer_1.default)({ storage: stroage }).single("photo");
