"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    message: { type: String },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room", required: true },
    senderName: { type: String, ref: "User", required: true },
    img: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Message", MessageSchema);
