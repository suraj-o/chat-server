"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_1 = require("./services/socket");
const connectDb_1 = require("./utils/connectDb");
// importa middleware
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorHandlers_1 = require("./middleware/ErrorHandlers");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// importes all routes
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = __importDefault(require("./routes/chat"));
// deafine port and socket
const PORT = process.env.PORT || 9000;
const socketIo = new socket_1.SocketIO();
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // startMessagesConsuming()
        // intializing and attaching http server and socket server 
        const app = (0, express_1.default)();
        const server = (0, http_1.createServer)(app);
        socketIo.io.attach(server);
        // database
        (0, connectDb_1.connectDb)(process.env.DB_URL);
        // binding and configuring middleware with server 
        app.use((0, morgan_1.default)("dev"));
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        }));
        // initializing static folder #uploads
        app.use("/uploads", express_1.default.static("uploads"));
        // routes
        app.use("/api/v1/user/", user_1.default);
        app.use("/api/v1/chat/", chat_1.default);
        // catchs global error
        app.use(ErrorHandlers_1.errorMiddleware);
        // call serevers
        socketIo.initSocketService();
        server.listen(PORT, () => console.log(`server is working on --port ${PORT}`));
    });
}
;
initServer();
