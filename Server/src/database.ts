import mongoose from "mongoose";



export const DB_Connection = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1:27017/TODO')
    .then(() => console.log('DB Connected!'));



}