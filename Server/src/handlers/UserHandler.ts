import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import UserModel from "../Modals/UserModel"
import dotenv from 'dotenv';
import {RedisMiddleware , setCache} from '../Redis/TaskEntity'
dotenv.config()

let store  = new UserModel()
export const UserHandler = (app:express.Application) => {
    app.post("/register" , async (req,res) => {
        const {username , password} = req.body;


        try {
           const hashed_pass = await bcrypt.hash(password+process.env.PEPPER , Number(process.env.SALT_ROUNDS as string) )
     
           const results = await store.User_Model.insertMany([{username,password:hashed_pass}]);
            res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error)
        }
    })  

    app.post("/login" , async(req:express.Request,res:express.Response) => {
        try {
            const results =  await store.User_Model.findOne({username:req.body.username})
            console.log(results)
            if(results){
               const flag = await bcrypt.compare(req.body.password+process.env.PEPPER , results.password as string)
               if(flag){
                   let token =  jwt.sign(req.body.username , process.env.SECRET as string)
                   res.status(200).json(token)
               }else{
                res.status(401).json({msg:"Wrong Password"})
               }
            }else{
                res.status(401).json({msg:"Wrong username"})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } )

    app.get("/users" , RedisMiddleware , async (req,res) => {
        try {
           const results = await store.User_Model.find({})
           await setCache(req.url , JSON.stringify(results))
           res.status(200).json(results)
        } catch (error) {
            res.status(500).json(error)
            
        }
    })
}