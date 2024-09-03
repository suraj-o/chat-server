import mongoose, { Schema } from "mongoose";

interface User{
    name:string
    email:string
    avatarUrl:string
    _id:string
}

interface RequestType{
    _id:string
    sender:User,
    reciver:User,
    status:"pending" | "accepted" | "rejected"
}

const schema = new Schema(
    {
        sender:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        reciver:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        status:{
            type:String,
            default:"pending",
            enum:["pending","accepted","rejected"]
        }
    },
    {
        timestamps:true
    }
);

export const AddRequest = mongoose.model<RequestType>("Request",schema)

