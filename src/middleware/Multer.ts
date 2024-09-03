import multer from "multer";
import {v4 as uuid} from "uuid"

const stroage=multer.diskStorage({
    destination(req,file,callback){
        callback(null,"uploads")
    },
    filename(req,file,callback){
        let id =uuid()
        const extname=file.originalname.split(".").pop();
        callback(null,`${id}.${extname}`)
    }
})

export const singleUpload=multer({storage:stroage}).single("photo");