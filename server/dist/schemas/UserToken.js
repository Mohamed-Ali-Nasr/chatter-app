"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});
exports.default = (0, mongoose_1.model)("UserToken", UserTokenSchema);
