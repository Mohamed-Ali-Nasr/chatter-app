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
exports.userSearch = exports.userIgnoreInvite = exports.userAcceptInvite = exports.getUserRooms = exports.getUserInviteList = exports.getAllUsers = void 0;
const Room_1 = __importDefault(require("../schemas/Room"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../schemas/User"));
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select("username _id email").exec();
        if (users.length === 1)
            throw (0, http_errors_1.default)(404, "there is no other users yet");
        return res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUserInviteList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    try {
        const invitedRooms = yield Room_1.default.find({
            inviteList: { $in: [new mongoose_1.default.Types.ObjectId(userId)] },
        }).select("name _id");
        if (invitedRooms.length === 0)
            return res.status(404).json({ message: "Room not found!" });
        return res.status(200).json(invitedRooms);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserInviteList = getUserInviteList;
const getUserRooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username } = req;
    if (!username || !userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const rooms = yield Room_1.default.find({ "users.userId": userId }).lean();
        const users = yield User_1.default.find();
        if (!rooms)
            throw (0, http_errors_1.default)(404, "Room not found!");
        rooms.forEach((room) => {
            const inviteList = [];
            const blackList = [];
            users.forEach((user) => {
                room.inviteList.forEach((invitedUser) => {
                    if (invitedUser.toString() === user._id.toString()) {
                        inviteList.push({
                            _id: user._id,
                            username: user.username,
                        });
                    }
                });
                room.blackList.forEach((bannedUserId) => {
                    if (bannedUserId.toString() === user._id.toString()) {
                        blackList.push({
                            _id: user._id,
                            username: user.username,
                        });
                    }
                });
                room.users.forEach((roomUser) => {
                    var _a, _b;
                    if (((_a = roomUser._id) === null || _a === void 0 ? void 0 : _a.toString()) === user._id.toString()) {
                        roomUser.username = user.username;
                    }
                    if (((_b = roomUser._id) === null || _b === void 0 ? void 0 : _b.toString()) === user._id.toString() &&
                        roomUser.role !== "7610") {
                        delete room._doc.inviteList;
                        delete room._doc.blackList;
                    }
                });
            });
            room.inviteList = inviteList;
            room.blackList = blackList;
        });
        res.status(200).json(rooms);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserRooms = getUserRooms;
const userAcceptInvite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, body } = req;
    if (!body.roomId || !userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const isUserInRoom = yield Room_1.default.findOne({
            "users.userId": new mongoose_1.default.Types.ObjectId(body.userId),
        });
        if (isUserInRoom)
            throw (0, http_errors_1.default)(404, "user already joined");
        const invitedRoom = yield Room_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(body.roomId),
        });
        if (!invitedRoom)
            throw (0, http_errors_1.default)(404, "not found any room with this id");
        const foundedUser = yield User_1.default.findOne({ _id: userId });
        yield invitedRoom._doc.inviteList.remove([userId]);
        invitedRoom.users.push({
            userId,
            role: "7610",
            username: foundedUser === null || foundedUser === void 0 ? void 0 : foundedUser.username,
        });
        yield invitedRoom.save();
        res.status(200).json({
            status: "success",
            message: "you accept the invite",
            room: invitedRoom,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userAcceptInvite = userAcceptInvite;
const userIgnoreInvite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, body } = req;
    if (!body.roomId || !userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const invitedRoom = yield Room_1.default.find({
            _id: new mongoose_1.default.Types.ObjectId(body.roomId),
        });
        if (!invitedRoom)
            throw (0, http_errors_1.default)(404, "not found any room with this id");
        yield invitedRoom[0]._doc.inviteList.remove([userId]);
        yield invitedRoom[0].save();
        res.status(200).json({
            status: "success",
            message: "you ignore the invite",
            roomId: body.roomId,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userIgnoreInvite = userIgnoreInvite;
const userSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, body } = req;
    if (!body.query || !body.roomId || !userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const inInviteListUsersID = yield Room_1.default.find({
            _id: body.roomId,
        }).distinct("inviteList");
        const inRoomUsersID = yield Room_1.default.find({ _id: body.roomId }).distinct("users.userId");
        const getInRoomUsersName = yield User_1.default.find()
            .where("_id")
            .in([...inInviteListUsersID, ...inRoomUsersID])
            .distinct("userName")
            .exec();
        const foundedUsers = yield User_1.default.find({
            $and: [
                { username: new RegExp(body.query, "i") },
                { username: { $not: { $in: getInRoomUsersName } } },
            ],
        }).select("username _id");
        if (foundedUsers.length === 0)
            throw (0, http_errors_1.default)(404, "There Is No Users Matched");
        return res.status(201).json(foundedUsers);
    }
    catch (error) {
        next(error);
    }
});
exports.userSearch = userSearch;
