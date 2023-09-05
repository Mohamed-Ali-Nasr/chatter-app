"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const verifyJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, validateEnv_1.default.ACCESS_TOKEN, (error, decode) => {
            if (error) {
                return res.status(404).json({
                    message: error,
                    error,
                });
            }
            else {
                req.userId = decode.id;
                req.username = decode.username;
                if (!req.userId) {
                    throw (0, http_errors_1.default)(401, "Invalid token.");
                }
                next();
            }
        });
    }
    else {
        next((0, http_errors_1.default)(401, "User not authenticated"));
    }
};
exports.verifyJWT = verifyJWT;
