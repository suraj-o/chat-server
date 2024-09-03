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
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_client_1 = require("./kafka-client");
function admin() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("admin connecting....");
        const admin = kafka_client_1.kafka.admin();
        admin.connect();
        const isTopicExist = (yield admin.listTopics()).find((value) => value === "Messages");
        if (isTopicExist) {
            console.log("topic alreadyExist");
            admin.disconnect();
            return null;
        }
        console.log("admin connected...");
        console.log("creating topics");
        yield admin.createTopics({
            topics: [{
                    topic: "Messages",
                    numPartitions: 2
                }]
        });
        console.log("topic created");
        admin.disconnect();
        console.log("admin disconneted...");
    });
}
admin();
