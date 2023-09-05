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
exports.uploadMessageImg = exports.addMessage = exports.getRoomMessages = exports.getAllRoomsMessages = void 0;
const Room_1 = __importDefault(require("../schemas/Room"));
const http_errors_1 = __importDefault(require("http-errors"));
const Message_1 = __importDefault(require("../schemas/Message"));
const getAllRoomsMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    if (!userId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const rooms = yield Room_1.default.find({
            "users.userId": userId,
        }).distinct("_id");
        const messages = yield Message_1.default.find({ roomId: { $in: rooms } });
        if (!messages)
            throw (0, http_errors_1.default)(404, "no message");
        return res.status(201).json(messages);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRoomsMessages = getAllRoomsMessages;
const getRoomMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    if (!roomId)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const messages = yield Message_1.default.find({ roomId });
        if (!messages)
            throw (0, http_errors_1.default)(404, "no message found!");
        return res.status(200).json(messages);
    }
    catch (error) {
        next(error);
    }
});
exports.getRoomMessages = getRoomMessages;
const addMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, userId: senderId, username } = req;
    const { roomId } = req.params;
    if (!roomId || !username || !senderId || !body)
        throw (0, http_errors_1.default)(406, "Missing data!");
    try {
        const isUserInRoom = yield Room_1.default.find({
            "users.userId": senderId,
            _id: roomId,
        });
        if (isUserInRoom.length === 0)
            throw (0, http_errors_1.default)(403, "you aren't on this room!");
        const newMessage = new Message_1.default({
            img: body.img,
            message: body.message,
            senderId,
            senderName: username,
            roomId,
        });
        if (!newMessage)
            throw (0, http_errors_1.default)(500, "cant send the message");
        yield newMessage.save();
        return res.status(201).json(newMessage);
    }
    catch (error) {
        next(error);
    }
});
exports.addMessage = addMessage;
const uploadMessageImg = (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            throw (0, http_errors_1.default)(400, "Please upload a file");
        }
        return res.status(200).json(file);
    }
    catch (error) {
        next(error);
    }
};
exports.uploadMessageImg = uploadMessageImg;
