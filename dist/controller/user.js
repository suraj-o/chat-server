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
exports.acceptRequest = exports.getAllnotification = exports.sendRequest = exports.search = exports.logout = exports.getMyprofie = exports.login = exports.signup = void 0;
const user_1 = require("../models/user");
const ErrorHandlers_1 = require("../middleware/ErrorHandlers");
const sendCookies_1 = require("../utils/sendCookies");
const bcrypt_1 = require("bcrypt");
const request_1 = require("../models/request");
const chats_1 = require("../models/chats");
const Avatars = [
    "https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6836.jpg",
    "https://as2.ftcdn.net/v2/jpg/07/66/92/63/1000_F_766926390_u7X44hVCILguNpQtiyWVw0pLQAyrSPVY.jpg",
    "https://img.freepik.com/premium-photo/doctor-3d-cartoon-illustration_826801-4468.jpg",
    "https://img.freepik.com/premium-photo/young-man-working-laptop-boy-freelancer-student-with-computer-cafe-table_826801-6658.jpg",
    "https://as2.ftcdn.net/v2/jpg/08/26/43/35/1000_F_826433595_14MbgOMLfgcZDgIRSwKLrhEjNqa6Bfcp.jpg",
    "https://i.pinimg.com/564x/4c/3e/c6/4c3ec62a87e5adc45d52c7022cea0823.jpg"
];
exports.signup = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(1);
    const { name, password, email } = req.body;
    const photo = req.file;
    if (!name || !email || !password)
        return next(new ErrorHandlers_1.ErrorHandler("fill all require things", 400));
    const isUser = yield user_1.User.findOne({ email });
    if (isUser)
        return next(new ErrorHandlers_1.ErrorHandler("user already exists", 400));
    console.log(Avatars[Math.floor(Math.random() * Avatars.length)]);
    const user = yield user_1.User.create({
        name,
        email,
        password,
        avatar: Avatars[Math.floor(Math.random() * Avatars.length)]
    });
    (0, sendCookies_1.sendCookies)(req, user._id, res, "sign up successfully", 200, next);
}));
exports.login = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new ErrorHandlers_1.ErrorHandler("please fill all require things", 400));
    const user = yield user_1.User.findOne({ email }).select("+password");
    if (!user)
        return next(new ErrorHandlers_1.ErrorHandler("user not found", 404));
    // comapre password 
    const isMatched = yield (0, bcrypt_1.compare)(password, user.password);
    if (!isMatched)
        return next(new ErrorHandlers_1.ErrorHandler("password does not match", 400));
    (0, sendCookies_1.sendCookies)(req, user._id, res, "login successfully", 200, next);
}));
exports.getMyprofie = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new ErrorHandlers_1.ErrorHandler("please provide your profile id", 400));
    const myDetails = yield user_1.User.findById(id);
    if (!myDetails)
        return next(new ErrorHandlers_1.ErrorHandler("invalid profile id", 404));
    res.status(200).json({
        success: true,
        user: myDetails
    });
}));
exports.logout = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.cookies["_id"]);
    if (!req.cookies["_id"])
        return next(new ErrorHandlers_1.ErrorHandler("already logged out", 404));
    res.status(200).cookie("_id", "", {
        maxAge: 0,
        sameSite: "none",
        httpOnly: true,
        secure: true
    })
        .json({
        success: true,
        message: "logged out"
    });
}));
exports.search = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    if (!req.cookies["_id"])
        return next(new ErrorHandlers_1.ErrorHandler("login please", 404));
    const id = (0, sendCookies_1.verifyToken)(req.cookies["_id"]);
    if (!id)
        return next(new ErrorHandlers_1.ErrorHandler("login please", 404));
    const chats = yield chats_1.Chat.find({ members: id });
    const allFriends = chats.flatMap((chat) => chat.members);
    const allExcludeMembers = yield user_1.User.find({ _id: { $nin: allFriends }, name: {
            $regex: name,
            $options: "i"
        } });
    res.status(200).json({
        sucess: true,
        allExcludeMembers
    });
}));
exports.sendRequest = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reciver } = req.body;
    const id = (0, sendCookies_1.verifyToken)(req.cookies["_id"]);
    const sentRequsetCheck = yield request_1.AddRequest.findOne({
        $or: [
            { sender: id, reciver },
            { sender: reciver, reciver: id }
        ]
    });
    if (sentRequsetCheck)
        return next(new ErrorHandlers_1.ErrorHandler("request already sent", 400));
    const request = yield request_1.AddRequest.create({
        reciver: reciver,
        sender: id,
    });
    res.status(200).json({
        success: true,
        request
    });
}));
exports.getAllnotification = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, sendCookies_1.verifyToken)(req.cookies["_id"]);
    const pendingRequest = yield request_1.AddRequest.find({ reciver: id }).populate("sender", "name avatar");
    if (!pendingRequest)
        return next(new ErrorHandlers_1.ErrorHandler("no request found", 404));
    res.status(200).json({
        sucess: true,
        requests: pendingRequest
    });
}));
exports.acceptRequest = (0, ErrorHandlers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(1);
    const { requestId, accept } = req.body;
    const me = (0, sendCookies_1.verifyToken)(req.cookies["_id"]);
    const checkRequest = yield request_1.AddRequest.findOne({ _id: requestId }).populate("sender", "name _id").populate("reciver", "name _id");
    if (!checkRequest)
        return next(new ErrorHandlers_1.ErrorHandler("Invalid request id", 404));
    if ((checkRequest === null || checkRequest === void 0 ? void 0 : checkRequest.reciver._id) == me) {
        return next(new ErrorHandlers_1.ErrorHandler("you have not permisson to accecpt this request", 400));
    }
    if (!accept) {
        yield checkRequest.deleteOne();
        return res.status(200).json({
            success: true,
            message: "request rejected"
        });
    }
    let members = [checkRequest.reciver, me];
    yield Promise.all([
        chats_1.Chat.create({
            name: `${(_a = checkRequest.sender) === null || _a === void 0 ? void 0 : _a.name}-${checkRequest.reciver.name}`,
            members: [
                checkRequest.sender,
                checkRequest.reciver
            ]
        }), request_1.AddRequest.deleteOne()
    ]);
    res.status(200).json({
        success: true,
        message: "now you have connected with this user",
    });
}));
