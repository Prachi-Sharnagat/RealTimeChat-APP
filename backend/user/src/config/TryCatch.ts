import type{ Request, Response, NextFunction, RequestHandler } from "express";
const TryCatch = (handler:RequestHandler): RequestHandler=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            await handler(req,res,next);
        }
        catch(error:unknown)
        {
           const message = error instanceof Error ? error.message : "something went wrong";
            res.status(500).json({
                message
            })
        }
    }
}

export default TryCatch
