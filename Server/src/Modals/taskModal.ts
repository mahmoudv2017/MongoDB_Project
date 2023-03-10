import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const task = new Schema({
  title: String,
  author: String,
  status:String,
  date: Date
});


export const taskModal = mongoose.model("Tasks",task);