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
exports.generateTokens = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserToken_1 = __importDefault(require("../schemas/UserToken"));
const validateEnv_1 = __importDefault(require("./validateEnv"));
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { id: user._id, username: user.username };
        const accessToken = jsonwebtoken_1.default.sign(payload, validateEnv_1.default.ACCESS_TOKEN, {
            expiresIn: "15h",
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, validateEnv_1.default.REFRESH_TOKEN, {
            expiresIn: "7d",
        });
        const userToken = yield UserToken_1.default.findOne({ userId: user._id });
        if (userToken)
            yield userToken.deleteOne();
        yield new UserToken_1.default({ userId: user._id, token: refreshToken }).save();
        return { accessToken, refreshToken };
    }
    catch (err) {
        return err;
    }
});
exports.generateTokens = generateTokens;
