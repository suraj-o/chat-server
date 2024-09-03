import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const sendCookies=(req:Request,id:any,res:Response,message:string,status:number,next:NextFunction):Response=>{
    
    if(req.cookies["_id"]){
        return res.status(400).json({
            success:false,
            message:"you are already logged in"
        })
    };
    
    const token =jwt.sign({_id:id},process.env.JWT_SECRET!)

    const cookieOption={

    }

    return res.cookie("_id",token,{
        maxAge:24 * 60 * 60 * 1000,
        secure:true,
        httpOnly:true,
        sameSite:"none"
    }).status(status).json({
        success:true,
        message,
        _id:id.toString()
    })
}

export const verifyToken=(token:string)=>{
    return  jwt.verify(token,process.env.JWT_SECRET as string);
}