import express from 'express'
import {groupModal} from '../Modals/groupModal'
import { RedisMiddleware  , setCache} from '../Redis/TaskEntity'

export const GroupHandler = (app:express.Application) => {
    app.get("/groups" , RedisMiddleware , async (req,res) => { //for development purpose only
        try {
            //63cc2fe11d6a695475114a72 grup ud
            const results = await groupModal.find({}).populate("todos").populate("author")
            await setCache(req.url , JSON.stringify(results))
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    app.get("/:userID/groups" , RedisMiddleware , async (req,res) => {
        try {
            const results = await groupModal.find({author:req.params.userID})
            await setCache(req.url , JSON.stringify(results))
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    app.get("/:userID/groups/:groupID" , async (req,res) => {
        try {
            const results = await groupModal.findOne({_id:req.params.groupID}).populate("author")
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    app.post("/groups" , async (req,res) => {
        try {
            const results = await groupModal.insertMany([ {title:req.body.title , author:req.body.author}])
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    app.patch("/groups/:id" , async (req,res) => {
        try {
            const results = await groupModal.updateOne({_id:req.params.id} , {title:req.body.title})
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    app.delete("/groups/:id" , async (req,res) => {
        try {
            const results = await groupModal.deleteOne({_id:req.params.id})
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })




    //adding tasks to a group
    app.post("/:userID/groups/:groupID" , async (req,res) => {
        try {
            const results = await groupModal.updateOne({_id:req.params.groupID} , {$push:{ todos:{$each:[{_id:req.body.taskID}]} }})
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error as string)
        }
    })

    //removing tasks from a group
    app.delete("/:userID/groups/:groupID" , async (req,res) => {
   
             groupModal.findById(req.params.groupID , (error:any , group:any) => {
                if(!error){
                    group.todos = group.todos.filter((todo:any) => todo !== +req.body.taskID)
                }else{
                    res.status(500).json(error as string)
                }
                console.log(group.todos)
                group.save()
                res.status(200).json(`Deleted task with ID ${req.body.taskID}`)
            })
           
      
    })
}