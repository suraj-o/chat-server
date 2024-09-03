import { hash } from "bcrypt"
import mongoose, { Schema } from "mongoose"


interface UserSchemaType{
    name:string,
    email:string,
    password:string,
    username:string,
    avatar:string,
    createdAt:Date,
    updatedAt:Date,
}

const schema= new Schema({
    name:{
        type:String,
        require:[true,"please put the name of user"]
    },
    password:{
        type:String,
        require:[true,"please put the password"],
        select:false
    },
    email:{
        type:String,
        unique:true,
        require:[true,"please enter email of the user"]
    },
    avatar:String
    
    },
    {
        timestamps:true
    }
);

schema.pre("save",async function(){
    if(!this.isModified("password")) return null
    this.password= await hash(this.password!,10)
})

export const User=mongoose.model<UserSchemaType>("User",schema)