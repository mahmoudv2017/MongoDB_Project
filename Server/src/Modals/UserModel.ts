import mongoose from "mongoose";
import express from 'express';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    username : String,
    password:String
})

export default class UserModel{
    User_Model = mongoose.model("users",UserSchema) 

    verifyAuthToken=(req:express.Request,res:express.Response , next:express.NextFunction) =>{
        try {
            let auth_headers = req.headers.authorization
            let token = auth_headers?.split(" ")[1] as string
           if( jwt.verify(token, process.env.SECRET as string)){
            next()
           }
            else{
                res.status(401).json({msg:"Token Denied"})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
} 