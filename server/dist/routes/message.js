"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJWT_1 = require("../middleware/verifyJWT");
const message_1 = require("../controllers/message");
const fileMiddleware_1 = require("../middleware/fileMiddleware");
exports.default = (router) => {
    router.get("/msg", verifyJWT_1.verifyJWT, message_1.getAllRoomsMessages);
    router.get("/msg/:roomId", verifyJWT_1.verifyJWT, message_1.getRoomMessages);
    router.post("/msg/:roomId", verifyJWT_1.verifyJWT, message_1.addMessage);
    router.post("/msg-upload-img", verifyJWT_1.verifyJWT, fileMiddleware_1.upload.single("image"), message_1.uploadMessageImg);
};
