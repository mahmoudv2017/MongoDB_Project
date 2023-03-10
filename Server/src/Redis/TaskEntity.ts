// import { Entity, Schema , Repository, Client } from "redis-om";
// import {createClient} from 'redis'
// const redis = createClient({
//     url:"redis://localhost:6379"
// })

import {createClient} from 'redis'
import express from 'express';
import dotenv from 'dotenv';
dotenv.config()

const {EXPIRATION_TIME} = process.env

const client = createClient()


// interface Task {

//     title: string;
//     author: string;
//     status: string;
//     date: string
//   }

// class Task extends Entity{}

// const schema = new Schema(Task , {
//     title: {type: 'string'},
//     author: {type: 'string'},
//     status:{type: 'string'},
//     date: {type: 'string'},
// })



// const getTaskRepo =   (client:any):Repository<Task> => {
  
//     return client.fetchRepository(schema)
// }

// export default getTaskRepo

const RedisMiddleware = async (req:express.Request,res:express.Response,next:express.NextFunction) => {

    const Key = req.url.replace("/","")
    console.log(Key)
    try {
        await client.connect()
        let cache_results = JSON.parse(await client.get(Key) as string) 
        if(!cache_results){ 
            console.log("Cache Miss") 
            next();
        }
        else{
            console.log("Cache Hit")
           // await client.disconnect()
    
            res.status(200).json(cache_results)
         
            return;

        }

    } catch (error) {
        console.log(error)
    } finally {
        await client.disconnect()
        
    }
   // next()
}

const setCache = async (key:string , value:string  )=>{

    try {
        await client.connect()
       await client.setEx(key.substring(1) , parseInt(EXPIRATION_TIME as string)  , value)
    } catch (error) {
        console.log(error)
    }finally  {
        await client.disconnect()
    }
}

export {RedisMiddleware , setCache}














