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
exports.isModerator = exports.isOwner = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Room_1 = __importDefault(require("../schemas/Room"));
const isOwner = (params) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, body } = req;
        switch (params) {
            case "delete":
                if (!body.roomId || !userId)
                    throw (0, http_errors_1.default)(406, "Missing data!");
                break;
            case "edit-room-name":
                if (!body.roomId || !body.newRoomName || !userId)
                    throw (0, http_errors_1.default)(406, "Missing data!");
                break;
        }
        const room = yield Room_1.default.findById({ _id: body.roomId });
        if (!room)
            throw (0, http_errors_1.default)(404, "Room not found!");
        let isUserOwner = false;
        room.users.forEach((user) => {
            if (user.role === "1769" && userId === user.userId) {
                isUserOwner = true;
            }
        });
        if (!isUserOwner)
            throw (0, http_errors_1.default)(403, "you are not the owner.");
        req.room = room;
        next();
    });
};
exports.isOwner = isOwner;
const isModerator = (params) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, body } = req;
        switch (params) {
            case "invite-list":
                if (!body.invitedUserId || !body.roomId || !userId)
                    throw (0, http_errors_1.default)(406, "Missing data!");
                break;
            case "black-list":
                if (!body.bannedUserId || !body.roomId || !userId)
                    throw (0, http_errors_1.default)(406, "Missing data!");
                break;
            case "cancel-invite-list":
                if (!body.canceledUserId || !body.roomId || !userId)
                    throw (0, http_errors_1.default)(406, "Missing data!");
                break;
            case "kick-user":
                if (!body.kickedUserId || !body.roomId || !userId)
                    throw (0, http_errors_1.default)(406, "Missing data!");
                break;
        }
        const room = yield Room_1.default.findById({ _id: body.roomId });
        if (!room)
            throw (0, http_errors_1.default)(404, "Room not found!");
        let isUserModerator = false;
        room.users.forEach((user) => {
            if ((user.role === "1769" || user.role === "2561") &&
                userId === user.userId) {
                isUserModerator = true;
            }
        });
        if (!isUserModerator)
            throw (0, http_errors_1.default)(403, "you are not the owner.");
        req.room = room;
        next();
    });
};
exports.isModerator = isModerator;
