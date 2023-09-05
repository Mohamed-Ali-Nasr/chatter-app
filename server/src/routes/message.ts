import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import {
  addMessage,
  getAllRoomsMessages,
  getRoomMessages,
  uploadMessageImg,
} from "../controllers/message";
import { upload } from "../middleware/fileMiddleware";

export default (router: Router) => {
  router.get("/msg", verifyJWT, getAllRoomsMessages);

  router.get("/msg/:roomId", verifyJWT, getRoomMessages);

  router.post("/msg/:roomId", verifyJWT, addMessage);

  router.post(
    "/msg-upload-img",
    verifyJWT,
    upload.single("image"),
    uploadMessageImg
  );
};
