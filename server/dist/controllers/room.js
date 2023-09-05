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
exports.unBannedUser = exports.kickUserFromRoom = exports.cancelUserInvite = exports.bannedUser = exports.inviteUserToRoom = exports.editRoomName = exports.deleteRoom = exports.userLeaveRoom = exports.createRoom = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Room_1 = __importDefault(require("../schemas/Room"));
const User_1 = __importDefault(require("../schemas/User"));
const createRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, userId, username } = req;
    if (!username || !body.name || !userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const ownerUser = {
            userId,
            username,
            role: "1769",
        };
        const newRoom = new Room_1.default({
            users: [ownerUser],
            message: [],
            inviteList: [],
            blackList: [],
            name: body.name,
        });
        yield newRoom.save();
        res.status(201).json({
            room: newRoom,
            status: "success",
            message: "room created successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createRoom = createRoom;
const userLeaveRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, userId } = req.body;
    if (!roomId || !userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const foundedRoom = yield Room_1.default.findOne({ _id: roomId });
        if (!foundedRoom)
            throw (0, http_errors_1.default)(404, "Room not found!");
        foundedRoom.users = foundedRoom.users.filter((user) => user.userId !== userId);
        yield foundedRoom.save();
        res
            .status(200)
            .json({ status: "success", message: "you leave room successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.userLeaveRoom = userLeaveRoom;
const deleteRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room } = req;
    try {
        yield (room === null || room === void 0 ? void 0 : room.deleteOne());
        return res
            .status(200)
            .json({ status: "success", message: "room deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRoom = deleteRoom;
const editRoomName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, body } = req;
    try {
        room.name = body.newRoomName;
        yield (room === null || room === void 0 ? void 0 : room.save());
        res.status(200).json({ status: "success", message: "room name changed" });
    }
    catch (error) {
        next(error);
    }
});
exports.editRoomName = editRoomName;
const inviteUserToRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, body } = req;
    const { invitedUserId } = body;
    let isUserOnInviteList = false;
    let isUserOnBlackList = false;
    let isAlreadyJoined = false;
    try {
        (room === null || room === void 0 ? void 0 : room.inviteList).forEach((userId) => {
            if (userId === invitedUserId) {
                isUserOnInviteList = true;
            }
        });
        if (isUserOnInviteList)
            throw (0, http_errors_1.default)(406, "user already invited");
        (room === null || room === void 0 ? void 0 : room.blackList).forEach((userId) => {
            if (userId === invitedUserId) {
                isUserOnBlackList = true;
            }
        });
        if (isUserOnBlackList)
            throw (0, http_errors_1.default)(406, "user already invited");
        room === null || room === void 0 ? void 0 : room.users.forEach((user) => {
            if (user.userId === invitedUserId) {
                isAlreadyJoined = true;
            }
        });
        if (isAlreadyJoined)
            throw (0, http_errors_1.default)(406, "user already joined");
        if (!isUserOnInviteList && !isUserOnBlackList && !isAlreadyJoined) {
            (room === null || room === void 0 ? void 0 : room.inviteList).push(invitedUserId);
        }
        yield (room === null || room === void 0 ? void 0 : room.save());
        return res.status(200).json({ status: "success", message: "user invited" });
    }
    catch (error) {
        next(error);
    }
});
exports.inviteUserToRoom = inviteUserToRoom;
const bannedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, body } = req;
    const { bannedUserId } = body;
    try {
        room.users = room.users.filter((user) => user.userId !== bannedUserId);
        const foundUser = yield User_1.default.findOne({ _id: bannedUserId }).select("_id");
        (room === null || room === void 0 ? void 0 : room.blackList).push(foundUser === null || foundUser === void 0 ? void 0 : foundUser._id);
        yield (room === null || room === void 0 ? void 0 : room.save());
        return res
            .status(200)
            .json({ status: "success", message: "user added to black list" });
    }
    catch (error) {
        next(error);
    }
});
exports.bannedUser = bannedUser;
const cancelUserInvite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, body } = req;
    const { canceledUserId } = body;
    try {
        const userInvited = (room === null || room === void 0 ? void 0 : room.inviteList).find((invitedUser) => invitedUser.toString() === canceledUserId);
        if (!userInvited)
            throw (0, http_errors_1.default)(404, "User not invited");
        room.inviteList = (room === null || room === void 0 ? void 0 : room.inviteList).filter((invitedUser) => invitedUser.toString() !== canceledUserId);
        yield (room === null || room === void 0 ? void 0 : room.save());
        return res.status(200).json({
            status: "success",
            message: "user canceled from invited List",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cancelUserInvite = cancelUserInvite;
const kickUserFromRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, body } = req;
    const { kickedUserId } = body;
    try {
        room.users = room.users.filter((user) => user.userId !== kickedUserId);
        yield (room === null || room === void 0 ? void 0 : room.save());
        return res.status(200).json({
            status: "success",
            message: "user kicked successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.kickUserFromRoom = kickUserFromRoom;
const unBannedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, body } = req;
    const { bannedUserId } = body;
    try {
        room.blackList = (room === null || room === void 0 ? void 0 : room.blackList).filter((userId) => userId.toString() !== bannedUserId);
        yield (room === null || room === void 0 ? void 0 : room.save());
        return res.status(200).json({
            status: "success",
            message: "user unbanned successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.unBannedUser = unBannedUser;
