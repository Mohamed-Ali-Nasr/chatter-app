"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenOptions = void 0;
const createTokenOptions = () => {
    if (process.env.NODE_ENV === "development") {
        return { httpOnly: false, secure: false, sameSite: true, signed: true };
    }
    else if (process.env.NODE_ENV === "production") {
        return { httpOnly: true, secure: true, sameSite: true, signed: true };
    }
};
exports.createTokenOptions = createTokenOptions;
