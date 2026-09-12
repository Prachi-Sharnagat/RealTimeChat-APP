import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import {createClient} from "redis";
import userRoutes from "./routes/user.route.js"
dotenv.config();
connectDB();

if(!process.env.REDIS_URL){
    throw new Error("REDIS_URL is not defined in Environment variables")
}

export const redisClient = createClient({url : process.env.REDIS_URL});
redisClient.connect().then(()=>{
    console.log("Redis is connect successfully");
}).catch(console.error);

const app = express();
app.use('api/v1', userRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});