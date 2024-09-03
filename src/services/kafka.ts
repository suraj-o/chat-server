import {Producer}from "kafkajs"
import {Messages} from "../models/messages"
import { kafka } from "./kafka-client"

// producers
interface MessageType{
    chatId:string
    from:string
    to:string
    message:string
}


let producer: null | Producer = null;


async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: MessageType) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: JSON.stringify(message) }],
    topic: "Messages",
  });
  return true;
}

// consumers
export async function startMessagesConsuming(){
    const consumer= kafka.consumer({groupId:"Default-Messages"});
    consumer.connect()
    await consumer.subscribe({ topic: "Messages", fromBeginning: true });
    
    await consumer.run({
        autoCommit:true,
        eachMessage:async ({message,pause})=>{
           try {
            if(!message.value) return ;
            await Messages.create(JSON.parse(message.value.toString()))
            console.log("message created")
           } catch (error) {
            pause();

            setTimeout(()=>{
                consumer.resume([{topic:"Messages"}])
            },(60 * 2) * 1000)
           } 
        }
    })
}
