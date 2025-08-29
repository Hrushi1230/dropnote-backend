import {Request ,Response ,NextFunction} from "express";
import {redis} from "../config/redis";

/*
A simple fixed-window rate limiter by key
*/

type keyFn =(req :Request) =>string;

export function rateLimit(opts:{key : keyFn; limit:number; windowSec:number}){
   return async (req:Request,res:Response ,next:NextFunction)=>{
       try{
          const key =opts.key(req);
          const ttlkey=`${key}:ttl`;
          const [count] =await redis
           .multi()
           .incr(key)
           .ttl(ttlkey)
           .exec()
           .then((arr)=>{
            return(
             [Number(arr?.[0]?.[1]??0),
              Number(arr?.[1]?.[1] ?? -2)
            ])
           });

           if(count===1){
            await redis.set(ttlkey, "1" ,"EX" ,opts.windowSec);
            await redis.expire(key, opts.windowSec);
           }
           if(count>opts.limit){
            return res.status(429).json({
                message:"Too many requests. Try later."
            });
           }
           return next();
       }
       catch(e){
        //fallback if redis fails
        return next();
       }
   };
}