import { NextFunction, Request, Response } from "express"

type PassFuncType=(req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>
interface ErrMiddalewaretype{
    err:ErrorHandler,
    req:Request,
    res:Response,
    next:NextFunction
}

export class ErrorHandler extends Error{
    constructor(public message:string,public status:number){
        super(message)
        this.status=status;
    };
}

export const errorMiddleware=( err:ErrorHandler,req:Request,res:Response,next:NextFunction)=>{
    err.message||="internal server error";
    err.status||=500;

    return res.status(err.status).json({
        success:false,
        message:err.message
    })
}

export const TryCatch=(passfunction:PassFuncType)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(passfunction(req,res,next)).catch(next)
}
