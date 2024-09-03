import mongoose from "mongoose";


export function connectDb(dbUrl:string){
    console.log(dbUrl)
    mongoose.connect(dbUrl,{
        dbName:"chatapp"
    }).then((db)=>console.log(db.connection.host)).catch((err)=>console.log(err))  
}