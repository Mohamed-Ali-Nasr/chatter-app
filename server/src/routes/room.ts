import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import {
  bannedUser,
  cancelUserInvite,
  createRoom,
  deleteRoom,
  editRoomName,
  inviteUserToRoom,
  kickUserFromRoom,
  unBannedUser,
  userLeaveRoom,
} from "../controllers/room";
import { isModerator, isOwner } from "../middleware/verifyRules";

export default (router: Router) => {
  router.post("/room", verifyJWT, createRoom);

  router.post("/room/leave", verifyJWT, userLeaveRoom);

  router.post("/room/delete", verifyJWT, isOwner("delete"), deleteRoom);

  router.post("/room/name", verifyJWT, isOwner("edit-room-name"), editRoomName);

  router.put(
    "/room/invite",
    verifyJWT,
    isModerator("invite-list"),
    inviteUserToRoom
  );

  router.put(
    "/room/blacklist",
    verifyJWT,
    isModerator("black-list"),
    bannedUser
  );

  router.post(
    "/room/cancel-invite",
    verifyJWT,
    isModerator("cancel-invite-list"),
    cancelUserInvite
  );

  router.post(
    "/room/kick-user",
    verifyJWT,
    isModerator("kick-user"),
    kickUserFromRoom
  );

  router.post(
    "/room/unban-user",
    verifyJWT,
    isModerator("black-list"),
    unBannedUser
  );
};
