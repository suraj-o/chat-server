import express from "express";
import { createServer } from "http";
import { SocketIO } from "./services/socket";
import { connectDb } from "./utils/connectDb";

// importa middleware
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/ErrorHandlers";

// importes all routes
import chatRouter from "./routes/chat";
import userRouter from "./routes/user";

// deafine port and socket
const PORT=process.env.PORT || 9000;
const socketIo=new SocketIO()

async function initServer(){
    // startMessagesConsuming()
    // intializing and attaching http server and socket server 
    const app = express();
    const server=createServer(app);
    socketIo.io.attach(server)
    
    // database
    connectDb(process.env.DB_URL as string)
    // binding and configuring middleware with server 
    app.use(morgan("dev"));
    app.use(express.urlencoded({extended:false}))
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin:process.env.CLIENT_URL as string,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials:true,
        allowedHeaders:["*"]
    }));

    // initializing static folder #uploads
    app.use("/uploads",express.static("uploads"))

    // routes
    app.use("/api/v1/user/",userRouter)
    app.use("/api/v1/chat/",chatRouter)



    // catchs global error
    app.use(errorMiddleware)

    // call serevers
    socketIo.initSocketService()
    server.listen(PORT,()=>console.log(`server is working on --port ${PORT}`))
};
initServer()