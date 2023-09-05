import { Router } from "express";
import {
  getAllUsers,
  getUserInviteList,
  getUserRooms,
  userAcceptInvite,
  userIgnoreInvite,
  userSearch,
} from "../controllers/user";
import { verifyJWT } from "../middleware/verifyJWT";

export default (router: Router) => {
  router.get("/user/get-users", getAllUsers);

  router.get("/user/invited-list", verifyJWT, getUserInviteList);

  router.get("/user/rooms", verifyJWT, getUserRooms);

  router.post("/user/accept-invite", verifyJWT, userAcceptInvite);

  router.post("/user/ignore-invite", verifyJWT, userIgnoreInvite);

  router.post("/user/search", verifyJWT, userSearch);
};
