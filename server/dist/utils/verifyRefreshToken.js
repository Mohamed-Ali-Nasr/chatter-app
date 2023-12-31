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
exports.verifyRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const UserToken_js_1 = __importDefault(require("../schemas/UserToken.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const verifyRefreshToken = (refreshToken) => {
    const privateKey = validateEnv_1.default.REFRESH_TOKEN;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UserToken_js_1.default.findOne({ token: refreshToken }, (err, doc) => __awaiter(void 0, void 0, void 0, function* () {
        if (!doc)
            throw (0, http_errors_1.default)(401, "Invalid refresh token.");
        jsonwebtoken_1.default.verify(refreshToken, privateKey, (err, tokenDetails) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw (0, http_errors_1.default)(401, "Invalid refresh token.");
            return {
                tokenDetails,
                error: false,
                message: "Valid refresh token",
            };
        }));
    }));
};
exports.verifyRefreshToken = verifyRefreshToken;
