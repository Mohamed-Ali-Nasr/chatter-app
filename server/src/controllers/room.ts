import { NextFunction, RequestHandler, Response } from "express";
import { IRequest } from "../middleware/verifyJWT";
import createHttpError from "http-errors";
import Room from "../schemas/Room";
import User from "../schemas/User";

export const createRoom = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { body, userId, username } = req;

  if (!username || !body.name || !userId)
    throw createHttpError(406, "Missing data!");

  try {
    const ownerUser = {
      userId,
      username,
      role: "1769",
    };

    const newRoom = new Room({
      users: [ownerUser],
      message: [],
      inviteList: [],
      blackList: [],
      name: body.name,
    });

    await newRoom.save();

    res.status(201).json({
      room: newRoom,
      status: "success",
      message: "room created successfully",
    });
  } catch (error) {
    next(error);
  }
};

interface userLeaveRoomBody {
  roomId: string;
  userId: string;
}

export const userLeaveRoom: RequestHandler<
  unknown,
  unknown,
  userLeaveRoomBody,
  unknown
> = async (req, res, next) => {
  const { roomId, userId } = req.body;

  if (!roomId || !userId) throw createHttpError(406, "Missing data!");

  try {
    const foundedRoom = await Room.findOne({ _id: roomId });

    if (!foundedRoom) throw createHttpError(404, "Room not found!");

    foundedRoom.users = foundedRoom.users.filter(
      (user) => user.userId !== userId
    );

    await foundedRoom.save();

    res
      .status(200)
      .json({ status: "success", message: "you leave room successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room } = req;
  try {
    await room?.deleteOne();

    return res
      .status(200)
      .json({ status: "success", message: "room deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const editRoomName = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room, body } = req;

  try {
    room!.name = body.newRoomName;

    await room?.save();

    res.status(200).json({ status: "success", message: "room name changed" });
  } catch (error) {
    next(error);
  }
};

export const inviteUserToRoom = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room, body } = req;
  const { invitedUserId } = body;

  let isUserOnInviteList = false;
  let isUserOnBlackList = false;
  let isAlreadyJoined = false;

  try {
    (room?.inviteList as string[]).forEach((userId) => {
      if (userId === invitedUserId) {
        isUserOnInviteList = true;
      }
    });

    if (isUserOnInviteList) throw createHttpError(406, "user already invited");

    (room?.blackList as string[]).forEach((userId) => {
      if (userId === invitedUserId) {
        isUserOnBlackList = true;
      }
    });

    if (isUserOnBlackList) throw createHttpError(406, "user already invited");

    room?.users.forEach((user) => {
      if (user.userId === invitedUserId) {
        isAlreadyJoined = true;
      }
    });

    if (isAlreadyJoined) throw createHttpError(406, "user already joined");

    if (!isUserOnInviteList && !isUserOnBlackList && !isAlreadyJoined) {
      (room?.inviteList as string[]).push(invitedUserId);
    }

    await room?.save();

    return res.status(200).json({ status: "success", message: "user invited" });
  } catch (error) {
    next(error);
  }
};

export const bannedUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room, body } = req;
  const { bannedUserId } = body;

  try {
    room!.users = room!.users.filter((user) => user.userId !== bannedUserId);

    const foundUser = await User.findOne({ _id: bannedUserId }).select("_id");

    (room?.blackList as string[]).push(foundUser?._id);

    await room?.save();

    return res
      .status(200)
      .json({ status: "success", message: "user added to black list" });
  } catch (error) {
    next(error);
  }
};

export const cancelUserInvite = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room, body } = req;
  const { canceledUserId } = body;

  try {
    const userInvited = (room?.inviteList as string[]).find(
      (invitedUser) => invitedUser.toString() === canceledUserId
    );

    if (!userInvited) throw createHttpError(404, "User not invited");

    room!.inviteList = (room?.inviteList as string[]).filter(
      (invitedUser) => invitedUser.toString() !== canceledUserId
    );

    await room?.save();

    return res.status(200).json({
      status: "success",
      message: "user canceled from invited List",
    });
  } catch (error) {
    next(error);
  }
};

export const kickUserFromRoom = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room, body } = req;
  const { kickedUserId } = body;

  try {
    room!.users = room!.users.filter((user) => user.userId !== kickedUserId);

    await room?.save();

    return res.status(200).json({
      status: "success",
      message: "user kicked successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const unBannedUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { room, body } = req;
  const { bannedUserId } = body;

  try {
    room!.blackList = (room?.blackList as string[]).filter(
      (userId) => userId.toString() !== bannedUserId
    );

    await room?.save();

    return res.status(200).json({
      status: "success",
      message: "user unbanned successfully",
    });
  } catch (error) {
    next(error);
  }
};
