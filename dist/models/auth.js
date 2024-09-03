"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const ErrorHandlers_1 = require("../middleware/ErrorHandlers");
const auth = (req, res, next) => {
    if (!req.cookies["_id"])
        return next(new ErrorHandlers_1.ErrorHandler("please login", 400));
    next();
};
exports.auth = auth;
