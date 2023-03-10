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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskHandler = void 0;
const taskModal_1 = require("../Modals/taskModal");
const TaskEntity_1 = require("../Redis/TaskEntity");
const TaskHandler = (app) => {
    app.get("/tasks", TaskEntity_1.RedisMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let results;
            const { group } = req.query;
            if (group) {
                let format = "";
                format = group == 'day' ? "%Y-%m-%d" : "%Y-%m";
                results = yield taskModal_1.taskModal.aggregate([{
                        $group: { _id: { $dateToString: { format: format, date: "$date" } }, tasks: { $push: { _id: "$_id", title: "$title", status: "$status" } }, count: { $sum: 1 } }
                    }]);
            }
            else {
                results = yield taskModal_1.taskModal.find();
            }
            yield (0, TaskEntity_1.setCache)(req.url, JSON.stringify(results));
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/tasks/:id", TaskEntity_1.RedisMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield taskModal_1.taskModal.findOne({ _id: req.params.id });
            yield (0, TaskEntity_1.setCache)(req.url, JSON.stringify(results));
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, author, status } = req.body;
        try {
            const date = new Date("2023-03-24");
            const results = yield taskModal_1.taskModal.insertMany([{ title, status, author, date: date }]);
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.patch("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title } = req.body;
        try {
            const results = yield taskModal_1.taskModal.updateOne({ _id: req.params.id }, { title });
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.delete("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield taskModal_1.taskModal.deleteOne({ _id: req.params.id });
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
};
exports.TaskHandler = TaskHandler;
