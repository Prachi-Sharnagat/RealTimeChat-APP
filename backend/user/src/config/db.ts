import mongoose from "mongoose"

const connectDB = async()=>{
    const url = process.env.MONGO_URL;

    if(!url){
        throw new Error("MONGO_URL is not defined in Environment variables")
    }

    try{
        await mongoose.connect(url,{
            dbName : "chatapp_user"
        });
        console.log(" MongoDB connected successfully")
    }
    catch(error){
        console.log("failed to connect MongoDB ", error);
        process.exit(1); 
        // use to shut down function 
    }

}

export default connectDB;
