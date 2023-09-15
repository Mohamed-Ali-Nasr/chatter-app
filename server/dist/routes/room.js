"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJWT_1 = require("../middleware/verifyJWT");
const room_1 = require("../controllers/room");
const verifyRules_1 = require("../middleware/verifyRules");
exports.default = (router) => {
    router.post("/room", verifyJWT_1.verifyJWT, room_1.createRoom);
    router.post("/room/leave", verifyJWT_1.verifyJWT, room_1.userLeaveRoom);
    router.post("/room/delete", verifyJWT_1.verifyJWT, (0, verifyRules_1.isOwner)("delete"), room_1.deleteRoom);
    router.post("/room/name", verifyJWT_1.verifyJWT, (0, verifyRules_1.isOwner)("edit-room-name"), room_1.editRoomName);
    router.put("/room/invite", verifyJWT_1.verifyJWT, (0, verifyRules_1.isModerator)("invite-list"), room_1.inviteUserToRoom);
    router.put("/room/blacklist", verifyJWT_1.verifyJWT, (0, verifyRules_1.isModerator)("black-list"), room_1.bannedUser);
    router.post("/room/cancel-invite", verifyJWT_1.verifyJWT, (0, verifyRules_1.isModerator)("cancel-invite-list"), room_1.cancelUserInvite);
    router.post("/room/kick-user", verifyJWT_1.verifyJWT, (0, verifyRules_1.isModerator)("kick-user"), room_1.kickUserFromRoom);
    router.post("/room/unban-user", verifyJWT_1.verifyJWT, (0, verifyRules_1.isModerator)("black-list"), room_1.unBannedUser);
};
