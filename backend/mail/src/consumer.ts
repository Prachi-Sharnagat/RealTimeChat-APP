import amqp from "amqplib"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();


export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            port: 5672,
            hostname: "localhost",
            username: process.env.RABBITMQ_USER!,
            password: process.env.RABBITMQ_PASSWORD!,
        })

        const channel = await connection.createChannel();
        const queueName = "send-otp";


        await channel.assertQueue(queueName, { durable: true })
        console.log("✅ Otp queue is ready");

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const user = process.env.USER || process.env.SMTP_USER;
                    const pass = process.env.PASSWORD || process.env.SMTP_PASS;

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user,
                            pass,
                        }
                    });
                    await transporter.sendMail({
                        from: `"ChatApp" <${user}>`,
                        to,
                        subject,
                        html: body,
                    });

                    console.log(`✅ mail sent to ${to}`);
                    channel.ack(msg);

                }
                catch (error) {
                    console.log("failed to process message", error);
                }


            }
        })
    }
    catch (error) {
        console.log("Failed to start otp consumer", error)
        process.exit(1);
    }
}