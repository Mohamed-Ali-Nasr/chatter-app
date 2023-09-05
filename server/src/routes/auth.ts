import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/auth";

export default (router: Router) => {
  router.post("/auth/register", register);

  router.post("/auth/login", login);

  router.get("/auth/refresh", refreshToken);

  router.get("/auth/logout", logout);
};
