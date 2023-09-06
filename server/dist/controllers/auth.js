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
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../schemas/User"));
const http_errors_1 = __importDefault(require("http-errors"));
const generateTokens_1 = require("../utils/generateTokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser)
            throw (0, http_errors_1.default)(400, "User already exists. Please choose a different one or log in instead.");
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new User_1.default({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json({ status: "success", message: "new user created" });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email })
            .select("+password +email")
            .exec();
        if (!user)
            throw (0, http_errors_1.default)(400, "Invalid email or password.");
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            throw (0, http_errors_1.default)(400, "Invalid email or password.");
        const { accessToken, refreshToken } = yield (0, generateTokens_1.generateTokens)(user);
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ accessToken });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.status(401).json({ message: "Unauthorized" });
    const refreshToken = cookies.jwt;
    if (refreshToken) {
        jsonwebtoken_1.default.verify(refreshToken, validateEnv_1.default.REFRESH_TOKEN, (error, decode) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                throw (0, http_errors_1.default)(403, "Forbidden");
            }
            else {
                const user = yield User_1.default.findOne({
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _id: decode.id,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    username: decode.username,
                }).exec();
                if (!user)
                    throw (0, http_errors_1.default)(401, "Unauthorized");
                const { accessToken } = yield (0, generateTokens_1.generateTokens)(user);
                res.status(201).json({ accessToken });
            }
        }));
    }
    else {
        next((0, http_errors_1.default)(401, "User not authenticated"));
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(204);
    res.clearCookie("jwt", { sameSite: "none", secure: true });
    res.sendStatus(200);
});
exports.logout = logout;
