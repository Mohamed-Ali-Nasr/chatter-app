"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenOptions = void 0;
const createTokenOptions = () => {
    if (process.env.NODE_ENV === "development") {
        return { httpOnly: false, secure: false, sameSite: "Lax" };
    }
    else if (process.env.NODE_ENV === "production") {
        return { httpOnly: true, secure: true, sameSite: "None" };
    }
};
exports.createTokenOptions = createTokenOptions;
