import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      port: 5672,
      hostname: process.env.RABBITMQ_HOST!,
      username: process.env.RABBITMQ_USER!,
      password: process.env.RABBITMQ_PASSWORD!
    });

    channel = await connection.createChannel();

    console.log("✅ connected to rabbitmq");
  } catch (error) {
    console.log("failed to connect rabbitmq", error);
    process.exit(1);
  }
};

export const publishToQueue = async(queueName:string, message:any)=>{
    if(!channel){
        console.log("rabbitmq channel is not connected");
        return;
    }
    await channel.assertQueue(queueName, {durable : true})
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
        persistent: true,
    })
    console.log(`published to queue ${queueName}`);
}