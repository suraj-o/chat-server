"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = exports.errorMiddleware = exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
        this.status = status;
    }
    ;
}
exports.ErrorHandler = ErrorHandler;
const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "internal server error");
    err.status || (err.status = 500);
    return res.status(err.status).json({
        success: false,
        message: err.message
    });
};
exports.errorMiddleware = errorMiddleware;
const TryCatch = (passfunction) => (req, res, next) => {
    Promise.resolve(passfunction(req, res, next)).catch(next);
};
exports.TryCatch = TryCatch;
