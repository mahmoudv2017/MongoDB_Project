import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const group = new Schema({
  title: String,
  author: {
    type:Schema.Types.ObjectId,
    ref:'users'
  },
  todos : [{
    type:Schema.Types.ObjectId,
    ref:'Tasks'
  }]
});


export const groupModal = mongoose.model("groups",group);