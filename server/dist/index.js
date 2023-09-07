"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const http_errors_1 = __importStar(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsOptions_1 = require("./config/corsOptions");
const credentials_1 = require("./middleware/credentials");
const logging_1 = __importDefault(require("./utils/logging"));
const routes_1 = __importDefault(require("./routes"));
const socket_io_1 = require("socket.io");
const Room_1 = __importDefault(require("./schemas/Room"));
const path_1 = __importDefault(require("path"));
/* Configuration */
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(credentials_1.credentials);
/* Creating Server */
const PORT = validateEnv_1.default.PORT;
const server = http_1.default.createServer(app).listen(PORT, () => {
    logging_1.default.log(`Server running on port: ${PORT}`);
});
const io = new socket_io_1.Server(server, {
    pingTimeout: 6000,
    cors: {
        origin: validateEnv_1.default.FRONT_END_URL,
    },
});
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userId) => {
        socket.join(userId);
        socket.emit("connected");
    });
    socket.on("join chat", (roomId) => {
        socket.join(roomId);
        console.log(`user joined new room with id ${roomId}`);
    });
    socket.on("new message", (receiveData) => {
        const { users, messageData } = receiveData;
        if (!users)
            return console.log("chat.users not defined");
        users.forEach((user) => {
            if ((user === null || user === void 0 ? void 0 : user.userId) !== messageData.senderId) {
                console.log(`i send message to ${user.userId}`);
                socket.broadcast
                    .to(user.userId)
                    .emit("new message", Object.assign({}, messageData));
            }
        });
    });
    socket.on("send invite", (receiveData) => {
        const inviteData = receiveData.inviteData;
        const roomId = receiveData.inviteData.roomId;
        const roomName = receiveData.roomName;
        if (inviteData.id) {
            socket
                .in(inviteData.id)
                .emit("get invite for user", { _id: roomId, name: roomName });
        }
    });
    socket.on("user kick", (receiveData) => {
        const { RoomId, userId } = receiveData;
        socket.in(userId).emit("user kicked", RoomId);
    });
    socket.on("remove from room invite list", (receiveData) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, userId } = receiveData;
        const foundedRoom = yield Room_1.default.findOne({ _id: roomId });
        foundedRoom === null || foundedRoom === void 0 ? void 0 : foundedRoom.users.forEach((user) => {
            if (user.userId !== userId) {
                socket
                    .to(user.userId)
                    .emit("user removed from room invite list", { roomId, userId });
            }
        });
    }));
    socket.on("user accept invite", (receiveData) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, userId, username } = receiveData;
        const foundedRoom = yield Room_1.default.findOne({ _id: roomId });
        foundedRoom === null || foundedRoom === void 0 ? void 0 : foundedRoom.users.forEach((user) => {
            if (user.userId !== userId) {
                socket
                    .to(user.userId)
                    .emit("user joined room", { roomId, userId, username });
            }
        });
    }));
    socket.on("admin cancel invite", (receiveData) => {
        const { roomId, userId } = receiveData;
        socket.to(userId).emit("invite canceled by admin", roomId);
    });
    socket.on("ban user", (receiveData) => {
        const { roomId, userId, roomName } = receiveData;
        socket.to(userId).emit("banned by admin", { roomId, roomName });
    });
    socket.on("delete room", (receiveData) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomName, roomId, roomUsers, myId } = receiveData;
        roomUsers.forEach((user) => {
            if (user.userId !== myId) {
                console.log(`user with id ${myId} delete room with name ${roomName} && id ${roomId}`);
                socket.to(user.userId).emit("remove room", { roomId, roomName });
            }
        });
    }));
    socket.on("change room name", (receiveData) => {
        const { newRoomName, roomId, roomUsers, myId } = receiveData;
        roomUsers.forEach((user) => {
            if (user.userId !== myId) {
                socket
                    .to(user.userId)
                    .emit("room name changed", { roomId, newRoomName });
            }
        });
    });
    socket.on("user leave the room", (receiveData) => {
        const { roomId, roomUsers, userId } = receiveData;
        roomUsers.forEach((user) => {
            if (user.userId !== userId) {
                socket
                    .to(user.userId)
                    .emit("user leave the room", { roomId, userId });
            }
        });
    });
});
/* Mongoose Setup */
mongoose_1.default.Promise = Promise;
mongoose_1.default
    .connect(validateEnv_1.default.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    logging_1.default.info("Connected to MongoDB");
})
    .catch((error) => {
    logging_1.default.error("Unable to connect to Mongo : ");
    logging_1.default.error(error);
});
mongoose_1.default.connection.on("error", (error) => console.log(error));
/* Routes */
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "public/images")));
app.use("/api", (0, routes_1.default)());
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../client/index.html"), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});
/* Error Handling */
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
