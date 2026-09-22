import { publishToQueue } from "../config/rabitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import User from "../model/model.js";
import { generateToken } from "./generateToken.js";

export const loginUser = TryCatch(async(req,res,next)=>{
    const {email} = req.body;
    const rateLimitKey = `otp:rateLimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if(rateLimit){
        return res.status(429).json({
            message: "too many requests, please wait before requesting new otp"
        });
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {EX : 300});
    await redisClient.set(rateLimitKey, "true", {
        EX: 60,
    });

    const message ={
        to : email,
        subject : "Your Otp is here",
        body : `Your OTP is : ${otp}. It is valid for 5 minutes`,
    };

    await publishToQueue("send-otp",message);
    return res.status(200).json({
        success : true,
        message : "OTP sent successfully",
    });
});

export const verifyUser = TryCatch(async(req, res)=>{
    const {email, otp:enteredOtp} = req.body;
    if(!email || !enteredOtp){
        res.status(400).json({
            message : "both otp and email required"
        });
        return;
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);
    if(!storedOtp || storedOtp !== enteredOtp){
        res.status(400).json({
            message :"INVALID OTP or EXPIRED OTP"
        });
        return;
    }

    await redisClient.del(otpKey);
    let user = await User.findOne({email});
    if(!user){
        const name = email.slice(0,8);
        user = await User.create({name, email});
    }

    const token = generateToken(user);
    res.json({
        message : "user verified",
        user,
        token
    });


    return res.status(200).json({
        success: true,
        message: "User verified successfully",
        user
    });
});