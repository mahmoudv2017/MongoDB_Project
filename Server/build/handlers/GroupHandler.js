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
exports.GroupHandler = void 0;
const groupModal_1 = require("../Modals/groupModal");
const TaskEntity_1 = require("../Redis/TaskEntity");
const GroupHandler = (app) => {
    app.get("/groups", TaskEntity_1.RedisMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //63cc2fe11d6a695475114a72 grup ud
            const results = yield groupModal_1.groupModal.find({}).populate("todos").populate("author");
            yield (0, TaskEntity_1.setCache)(req.url, JSON.stringify(results));
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/:userID/groups", TaskEntity_1.RedisMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield groupModal_1.groupModal.find({ author: req.params.userID });
            yield (0, TaskEntity_1.setCache)(req.url, JSON.stringify(results));
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/:userID/groups/:groupID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield groupModal_1.groupModal.findOne({ _id: req.params.groupID }).populate("author");
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/groups", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield groupModal_1.groupModal.insertMany([{ title: req.body.title, author: req.body.author }]);
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.patch("/groups/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield groupModal_1.groupModal.updateOne({ _id: req.params.id }, { title: req.body.title });
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.delete("/groups/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield groupModal_1.groupModal.deleteOne({ _id: req.params.id });
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    //adding tasks to a group
    app.post("/:userID/groups/:groupID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield groupModal_1.groupModal.updateOne({ _id: req.params.groupID }, { $push: { todos: { $each: [{ _id: req.body.taskID }] } } });
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    //removing tasks from a group
    app.delete("/:userID/groups/:groupID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        groupModal_1.groupModal.findById(req.params.groupID, (error, group) => {
            if (!error) {
                group.todos = group.todos.filter((todo) => todo !== +req.body.taskID);
            }
            else {
                res.status(500).json(error);
            }
            console.log(group.todos);
            group.save();
            res.status(200).json(`Deleted task with ID ${req.body.taskID}`);
        });
    }));
};
exports.GroupHandler = GroupHandler;
