import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { ErrorHandler, TryCatch } from "../middleware/ErrorHandlers";
import { sendCookies, verifyToken } from "../utils/sendCookies";
import { compare } from "bcrypt";
import { AddRequest } from "../models/request";
import { Chat } from "../models/chats";

interface signupReqbodyType{
    name:string,
    email:string,
    password:string,
}

const Avatars=[
    "https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6836.jpg",
    "https://as2.ftcdn.net/v2/jpg/07/66/92/63/1000_F_766926390_u7X44hVCILguNpQtiyWVw0pLQAyrSPVY.jpg",
    "https://img.freepik.com/premium-photo/doctor-3d-cartoon-illustration_826801-4468.jpg",
    "https://img.freepik.com/premium-photo/young-man-working-laptop-boy-freelancer-student-with-computer-cafe-table_826801-6658.jpg",
    "https://as2.ftcdn.net/v2/jpg/08/26/43/35/1000_F_826433595_14MbgOMLfgcZDgIRSwKLrhEjNqa6Bfcp.jpg",
    "https://i.pinimg.com/564x/4c/3e/c6/4c3ec62a87e5adc45d52c7022cea0823.jpg"
    ]

export const signup=TryCatch(async(req:Request<{},{},signupReqbodyType>,res:Response,next:NextFunction)=>{
    console.log(1)
const{name,password,email} = req.body;
const photo=req.file;
if(!name|| !email || !password) return next(new ErrorHandler("fill all require things",400));

    const isUser = await User.findOne({email});

    if(isUser) return next(new ErrorHandler("user already exists",400));
    console.log(Avatars[Math.floor(Math.random() * Avatars.length)])
       const user = await User.create({
            name,
            email,
            password,
            avatar: Avatars[Math.floor(Math.random() * Avatars.length)]
        })

        sendCookies(req,user._id,res,"sign up successfully",200,next)
    }

)

export const login=TryCatch(async(req:Request<{},{},{
    email:string,
    password:string
}>,res:Response,next:NextFunction)=>{
    const {email,password}=req.body;
    if(!email || !password) return next(new ErrorHandler("please fill all require things",400));

    const user = await User.findOne({email}).select("+password");
    if(!user) return next(new ErrorHandler("user not found",404));
    
    // comapre password 
    const isMatched= await compare(password,user.password);
    if(!isMatched) return next(new ErrorHandler("password does not match",400));

    sendCookies(req,user._id,res,"login successfully",200,next)
})

export const getMyprofie=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params;
    
    if(!id) return next(new ErrorHandler("please provide your profile id",400));
    
    
    const myDetails=await User.findById(id);
    if(!myDetails) return next(new ErrorHandler("invalid profile id",404));
    

    res.status(200).json({
        success:true,
        user:myDetails
    })
});

export const logout=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.cookies["_id"])
    if(!req.cookies["_id"])return next(new ErrorHandler("already logged out",404));
  
    res.status(200).cookie("_id","",{
        maxAge:0,
        sameSite:"none",
        httpOnly:true,
        secure:true})
                    .json({
                            success:true,
                            message:"logged out"
                        })
})

export const search=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    
    const {name}=req.query;
    if(!req.cookies["_id"]) return next(new ErrorHandler("login please",404));

    const id =verifyToken(req.cookies["_id"]);

    if(!id) return next(new ErrorHandler("login please",404)) 

    const chats = await Chat.find({members:id});
    const allFriends= chats.flatMap((chat)=>chat.members);

        const allExcludeMembers= await User.find({_id:{$nin:allFriends},name:{
            $regex:name,
            $options: "i"
        }})

        res.status(200).json({
            sucess:true,
            allExcludeMembers
        })
})

export const sendRequest=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {reciver}=req.body;
    const id=verifyToken(req.cookies["_id"])


    const sentRequsetCheck= await AddRequest.findOne({
        $or:[
            {sender:id,reciver},
            {sender:reciver,reciver:id}
        ]
    })

    if(sentRequsetCheck) return next(new ErrorHandler("request already sent",400));

    const request= await AddRequest.create({
        reciver:reciver,
        sender:id,
    })

    res.status(200).json({
        success:true,
        request
    })
})

export const getAllnotification=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const id= verifyToken(req.cookies["_id"]);

    const pendingRequest=await AddRequest.find({reciver:id}).populate("sender","name avatar");
            if(!pendingRequest) return next(new ErrorHandler("no request found",404));

    res.status(200).json({
        sucess:true,
        requests:pendingRequest
    })
})

export const acceptRequest=TryCatch(async(req:Request<{},{},{requestId:string,accept:boolean}>,res:Response,next:NextFunction)=>{
    console.log(1)
    const {requestId,accept}=req.body;
    const me =verifyToken(req.cookies["_id"])
 
       const checkRequest= await AddRequest.findOne({_id:requestId}).populate("sender","name _id").populate("reciver","name _id");
       if(!checkRequest) return next(new ErrorHandler("Invalid request id",404));
 
       
     if(checkRequest?.reciver!._id == me){
         return next(new ErrorHandler("you have not permisson to accecpt this request",400))
     }
 
         if(!accept){
             await checkRequest.deleteOne();
 
             return res.status(200).json({
                 success:true,
                 message:"request rejected"
             })
         }
 
         let members = [checkRequest.reciver,me];
     
     await Promise.all([
         Chat.create({
             name:`${checkRequest.sender?.name}-${checkRequest.reciver!.name}`,
             members:[
                checkRequest.sender,
                checkRequest.reciver
             ]
         }),AddRequest.deleteOne()
     ])
     res.status(200).json({
         success:true,
         message:"now you have connected with this user",
     })
 })


