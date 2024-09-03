import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../middleware/ErrorHandlers";


export const auth=(req:Request,res:Response,next:NextFunction)=>{
    if(!req.cookies["_id"]) return next(new ErrorHandler("please login",400))
    
    next()
}