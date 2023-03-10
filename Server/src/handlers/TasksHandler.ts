import express from 'express';
import { taskModal } from '../Modals/taskModal';
import {RedisMiddleware , setCache} from '../Redis/TaskEntity';


export const TaskHandler = (app: express.Application) => {
    app.get("/tasks", RedisMiddleware ,  async (req, res) => { //shoud it be in the url


        try {
            let results:any;
            const {group} = req.query
            if(group){
                let format = ""
                format = group == 'day' ? "%Y-%m-%d" : "%Y-%m"
                
                results = await taskModal.aggregate([{
                    $group:{_id:{$dateToString:{format:format , date:"$date"}} , tasks:{$push:{_id:"$_id",  title:"$title" , status:"$status"}} , count:{$sum:1}}
                }])
                
            }
            else{
                 results = await taskModal.find()
            }
            await setCache(req.url , JSON.stringify(results) )
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
       
     

    })

    app.get("/tasks/:id" , RedisMiddleware , async (req, res) => {
        try {
            const results:any = await taskModal.findOne({_id:req.params.id})
           await setCache( req.url, JSON.stringify(results))
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

   

    app.post("/tasks", async (req, res) => {
        const {title , author , status} = req.body
   
        try {
            const date = new Date("2023-03-24")
            const results = await taskModal.insertMany([{title , status , author ,date:date}])
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })


    app.patch("/tasks/:id", async (req, res) => {
        const {title} = req.body
   
        try {
            const results = await taskModal.updateOne({_id:req.params.id} , {title})
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    app.delete("/tasks/:id", async (req, res) => {
        try {
            const results = await taskModal.deleteOne({_id:req.params.id})
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })
}