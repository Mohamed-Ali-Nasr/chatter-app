import { NextFunction, Response } from "express";
import { IRequest } from "./verifyJWT";
import createHttpError from "http-errors";
import Room from "../schemas/Room";

export const isOwner = (params: string) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    const { userId, body } = req;

    switch (params) {
      case "delete":
        if (!body.roomId || !userId)
          throw createHttpError(406, "Missing data!");
        break;

      case "edit-room-name":
        if (!body.roomId || !body.newRoomName || !userId)
          throw createHttpError(406, "Missing data!");
        break;
    }

    const room = await Room.findById({ _id: body.roomId });

    if (!room) throw createHttpError(404, "Room not found!");

    let isUserOwner = false;

    room.users.forEach((user) => {
      if (user.role === "1769" && userId === user.userId) {
        isUserOwner = true;
      }
    });

    if (!isUserOwner) throw createHttpError(403, "you are not the owner.");

    req.room = room;

    next();
  };
};

export const isModerator = (params: string) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    const { userId, body } = req;

    switch (params) {
      case "invite-list":
        if (!body.invitedUserId || !body.roomId || !userId)
          throw createHttpError(406, "Missing data!");
        break;

      case "black-list":
        if (!body.bannedUserId || !body.roomId || !userId)
          throw createHttpError(406, "Missing data!");
        break;

      case "cancel-invite-list":
        if (!body.canceledUserId || !body.roomId || !userId)
          throw createHttpError(406, "Missing data!");
        break;

      case "kick-user":
        if (!body.kickedUserId || !body.roomId || !userId)
          throw createHttpError(406, "Missing data!");
        break;
    }

    const room = await Room.findById({ _id: body.roomId });

    if (!room) throw createHttpError(404, "Room not found!");

    let isUserModerator = false;

    room.users.forEach((user) => {
      if (
        (user.role === "1769" || user.role === "2561") &&
        userId === user.userId
      ) {
        isUserModerator = true;
      }
    });

    if (!isUserModerator) throw createHttpError(403, "you are not the owner.");

    req.room = room;

    next();
  };
};
