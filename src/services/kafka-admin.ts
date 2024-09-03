import { kafka } from "./kafka-client";

async function admin(){
    console.log("admin connecting....");
    const admin = kafka.admin();
    admin.connect();

   const isTopicExist=(await admin.listTopics()).find((value)=>value==="Messages")

   if(isTopicExist){
    console.log("topic alreadyExist");
    admin.disconnect();
    
    return null
   }

    console.log("admin connected...")
    console.log("creating topics");

    await admin.createTopics({
        topics:[{
            topic:"Messages",
            numPartitions:2
        }]
    })
    console.log("topic created")

    admin.disconnect();
    console.log("admin disconneted...")
}

admin()
