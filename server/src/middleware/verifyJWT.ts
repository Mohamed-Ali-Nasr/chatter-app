import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import env from "../utils/validateEnv";
import { IRoomSchema } from "../schemas/Room";

export interface IRequest extends Request {
  userId?: string;
  username?: string;
  room?: IRoomSchema;
}

export const verifyJWT = (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    JWT.verify(token, env.ACCESS_TOKEN, (error, decode) => {
      if (error) {
        return res.status(404).json({
          message: error,
          error,
        });
      } else {
        req.userId = (decode as any).id;
        req.username = (decode as any).username;

        if (!req.userId) {
          throw createHttpError(401, "Invalid token.");
        }

        next();
      }
    });
  } else {
    next(createHttpError(401, "User not authenticated"));
  }
};
