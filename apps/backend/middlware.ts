

import type{ NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
export const middleware = (req:Request,res:Response,next:NextFunction)=>{

    //@ts-ignore
    const token = req.header("Authorization");
    console.log('token',token)
    if(!token) return;
    jwt.verify(token , process.env.JWT_SECRET as any ,(err: any, res: any)=>{
        //@ts-ignore
        if(err){
            return res.status.json({
                message: "Invalid token"
            })
        }

        // @ts-ignore
        req.userId = res.userId;
        next();
    });

     

}
