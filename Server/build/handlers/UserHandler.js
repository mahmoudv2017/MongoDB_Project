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
exports.UserHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../Modals/UserModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const TaskEntity_1 = require("../Redis/TaskEntity");
dotenv_1.default.config();
let store = new UserModel_1.default();
const UserHandler = (app) => {
    app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const hashed_pass = yield bcrypt_1.default.hash(password + process.env.PEPPER, Number(process.env.SALT_ROUNDS));
            const results = yield store.User_Model.insertMany([{ username, password: hashed_pass }]);
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield store.User_Model.findOne({ username: req.body.username });
            console.log(results);
            if (results) {
                const flag = yield bcrypt_1.default.compare(req.body.password + process.env.PEPPER, results.password);
                if (flag) {
                    let token = jsonwebtoken_1.default.sign(req.body.username, process.env.SECRET);
                    res.status(200).json(token);
                }
                else {
                    res.status(401).json({ msg: "Wrong Password" });
                }
            }
            else {
                res.status(401).json({ msg: "Wrong username" });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/users", TaskEntity_1.RedisMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield store.User_Model.find({});
            yield (0, TaskEntity_1.setCache)(req.url, JSON.stringify(results));
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
};
exports.UserHandler = UserHandler;