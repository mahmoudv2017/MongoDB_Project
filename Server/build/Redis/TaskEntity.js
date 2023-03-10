"use strict";
// import { Entity, Schema , Repository, Client } from "redis-om";
// import {createClient} from 'redis'
// const redis = createClient({
//     url:"redis://localhost:6379"
// })
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
exports.setCache = exports.RedisMiddleware = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { EXPIRATION_TIME } = process.env;
const client = (0, redis_1.createClient)();
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
const RedisMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Key = req.url.replace("/", "");
    console.log(Key);
    try {
        yield client.connect();
        let cache_results = JSON.parse(yield client.get(Key));
        if (!cache_results) {
            console.log("Cache Miss");
            next();
        }
        else {
            console.log("Cache Hit");
            // await client.disconnect()
            res.status(200).json(cache_results);
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        yield client.disconnect();
    }
    // next()
});
exports.RedisMiddleware = RedisMiddleware;
const setCache = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        yield client.setEx(key.substring(1), parseInt(EXPIRATION_TIME), value);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        yield client.disconnect();
    }
});
exports.setCache = setCache;
