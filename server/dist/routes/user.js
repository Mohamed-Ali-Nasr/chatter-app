"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controllers/user");
const verifyJWT_1 = require("../middleware/verifyJWT");
exports.default = (router) => {
    router.get("/user/get-users", user_1.getAllUsers);
    router.get("/user/invited-list", verifyJWT_1.verifyJWT, user_1.getUserInviteList);
    router.get("/user/rooms", verifyJWT_1.verifyJWT, user_1.getUserRooms);
    router.post("/user/accept-invite", verifyJWT_1.verifyJWT, user_1.userAcceptInvite);
    router.post("/user/ignore-invite", verifyJWT_1.verifyJWT, user_1.userIgnoreInvite);
    router.post("/user/search", verifyJWT_1.verifyJWT, user_1.userSearch);
};
