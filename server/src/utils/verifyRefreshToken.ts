import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import UserToken from "../schemas/UserToken.js";
import createHttpError from "http-errors";

export const verifyRefreshToken = (refreshToken: string) => {
  const privateKey = env.REFRESH_TOKEN;

  UserToken.findOne({ token: refreshToken }, async (err: any, doc: any) => {
    if (!doc) throw createHttpError(401, "Invalid refresh token.");

    jwt.verify(refreshToken, privateKey, async (err, tokenDetails) => {
      if (err) throw createHttpError(401, "Invalid refresh token.");

      return {
        tokenDetails,
        error: false,
        message: "Valid refresh token",
      };
    });
  });
};
