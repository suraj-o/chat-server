"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const Multer_1 = require("../middleware/Multer");
const user = express_1.default.Router();
user.post("/signup", Multer_1.singleUpload, user_1.signup);
user.post("/login", user_1.login);
user.get("/logout", user_1.logout);
user.get("/search", user_1.search);
user.post("/request", user_1.sendRequest);
user.get("/notifications", user_1.getAllnotification);
user.put("/request/response", user_1.acceptRequest);
user.get("/profile/:id", user_1.getMyprofie);
exports.default = user;
