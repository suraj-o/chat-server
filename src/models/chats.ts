import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
    {
        members:[
            {
                type:mongoose.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    {
        timestamps:true
    }
)

export const Chat= mongoose.model("Chat",schema)