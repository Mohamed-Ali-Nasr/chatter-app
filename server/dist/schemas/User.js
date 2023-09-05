"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, min: 5, max: 35, unique: true },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 5 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", UserSchema);
