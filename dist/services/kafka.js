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
exports.produceMessage = produceMessage;
exports.startMessagesConsuming = startMessagesConsuming;
const messages_1 = require("../models/messages");
const kafka_client_1 = require("./kafka-client");
let producer = null;
function createProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (producer)
            return producer;
        const _producer = kafka_client_1.kafka.producer();
        yield _producer.connect();
        producer = _producer;
        return producer;
    });
}
function produceMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = yield createProducer();
        yield producer.send({
            messages: [{ key: `message-${Date.now()}`, value: JSON.stringify(message) }],
            topic: "Messages",
        });
        return true;
    });
}
// consumers
function startMessagesConsuming() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka_client_1.kafka.consumer({ groupId: "Default-Messages" });
        consumer.connect();
        yield consumer.subscribe({ topic: "Messages", fromBeginning: true });
        yield consumer.run({
            autoCommit: true,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message, pause }) {
                try {
                    if (!message.value)
                        return;
                    yield messages_1.Messages.create(JSON.parse(message.value.toString()));
                    console.log("message created");
                }
                catch (error) {
                    pause();
                    setTimeout(() => {
                        consumer.resume([{ topic: "Messages" }]);
                    }, (60 * 2) * 1000);
                }
            })
        });
    });
}
