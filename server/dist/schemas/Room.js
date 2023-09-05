"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    users: { type: Array, ref: "User" },
    messages: { type: Array },
    inviteList: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User" },
    blackList: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User" },
    name: { type: String, require: true },
});
exports.default = (0, mongoose_1.model)("Room", RoomSchema);
