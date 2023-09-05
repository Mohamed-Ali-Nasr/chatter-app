import express, { Router } from "express";
import auth from "./auth";
import user from "./user";
import message from "./message";
import room from "./room";

const router = express.Router();

export default (): Router => {
  auth(router);
  user(router);
  message(router);
  room(router);

  return router;
};
