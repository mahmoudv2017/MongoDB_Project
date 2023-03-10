import express from 'express';
import dotenv from 'dotenv';
import ejs from 'ejs';
import { DB_Connection } from './database';
import { TaskHandler } from './handlers/TasksHandler';
import { UserHandler } from './handlers/UserHandler';
import { GroupHandler } from './handlers/GroupHandler';

//const client = new Client()

//redis.on("error", (err) => console.error("client err", err));

dotenv.config()

const app = express();
app.use(express.json())
app.use(express.static("assets"))
app.set("view engine",'ejs')

DB_Connection();

app.listen(process.env.PORT , async () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`)

  



})

app.get("/" , (req,res)=>{
    res.render("index.ejs")
})
TaskHandler(app)
UserHandler(app)
GroupHandler(app)
