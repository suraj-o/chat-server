"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDb(dbUrl) {
    console.log(dbUrl);
    mongoose_1.default.connect(dbUrl, {
        dbName: "chatapp"
    }).then((db) => console.log(db.connection.host)).catch((err) => console.log(err));
}
