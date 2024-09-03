"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafka = void 0;
const kafkajs_1 = require("kafkajs");
exports.kafka = new kafkajs_1.Kafka({
    brokers: [`${process.env.KAFKA_USER_IP}:${process.env.KAFKA_PORT}`],
    clientId: "ting-tong"
});
