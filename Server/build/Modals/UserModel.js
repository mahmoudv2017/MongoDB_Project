"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.default.Schema({
    username: String,
    password: String
});
class UserModel {
    constructor() {
        this.User_Model = mongoose_1.default.model("users", UserSchema);
        this.verifyAuthToken = (req, res, next) => {
            try {
                let auth_headers = req.headers.authorization;
                let token = auth_headers === null || auth_headers === void 0 ? void 0 : auth_headers.split(" ")[1];
                if (jsonwebtoken_1.default.verify(token, process.env.SECRET)) {
                    next();
                }
                else {
                    res.status(401).json({ msg: "Token Denied" });
                }
            }
            catch (error) {
                res.status(500).json(error);
            }
        };
    }
}
exports.default = UserModel;
