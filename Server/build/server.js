"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const TasksHandler_1 = require("./handlers/TasksHandler");
const UserHandler_1 = require("./handlers/UserHandler");
const GroupHandler_1 = require("./handlers/GroupHandler");
//const client = new Client()
//redis.on("error", (err) => console.error("client err", err));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("assets"));
app.set("view engine", 'ejs');
(0, database_1.DB_Connection)();
app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
}));
app.get("/", (req, res) => {
    res.render("index.ejs");
});
(0, TasksHandler_1.TaskHandler)(app);
(0, UserHandler_1.UserHandler)(app);
(0, GroupHandler_1.GroupHandler)(app);
