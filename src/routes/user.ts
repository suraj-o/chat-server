import express from "express";
import { acceptRequest, getAllnotification, getMyprofie, login, logout, search, sendRequest, signup } from "../controller/user";
import { singleUpload } from "../middleware/Multer";
import { auth } from "../models/auth";

const user=express.Router();

user.post("/signup",singleUpload,signup)
user.post("/login",login)
user.get("/logout",logout)
user.get("/search",search)
user.post("/request",sendRequest)
user.get("/notifications",getAllnotification)
user.put("/request/response",acceptRequest)
user.get("/profile/:id",getMyprofie)


export default user
