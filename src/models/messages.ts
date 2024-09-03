import mongoose, { Schema } from "mongoose";


const schema=new Schema(
    {
        chatId:{
            type:mongoose.Types.ObjectId,
            ref:"Chat"
        },
        message:String,
        from:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        to:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
    },
    {
        timestamps:true
    }
)

export const Messages=mongoose.model("Messages",schema)