import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    brokers:[`${process.env.KAFKA_USER_IP}:${process.env.KAFKA_PORT}`],
    clientId:"ting-tong"
})