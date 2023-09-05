import { NextFunction, RequestHandler, Response } from "express";
import { IRequest } from "../middleware/verifyJWT";
import Room from "../schemas/Room";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import User from "../schemas/User";
import { IUser } from "../types/IUser";

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find().select("username _id email").exec();

    if (users.length === 1)
      throw createHttpError(404, "there is no other users yet");

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserInviteList = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  try {
    const invitedRooms = await Room.find({
      inviteList: { $in: [new mongoose.Types.ObjectId(userId)] },
    }).select("name _id");

    if (invitedRooms.length === 0)
      return res.status(404).json({ message: "Room not found!" });

    return res.status(200).json(invitedRooms);
  } catch (error) {
    next(error);
  }
};

export const getUserRooms = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId, username } = req;

  if (!username || !userId) throw createHttpError(406, "Missing data!");

  try {
    const rooms = await Room.find({ "users.userId": userId }).lean();

    const users = await User.find();

    if (!rooms) throw createHttpError(404, "Room not found!");

    rooms.forEach((room) => {
      const inviteList: IUser[] = [];
      const blackList: IUser[] = [];

      users.forEach((user) => {
        (room.inviteList as string[]).forEach((invitedUser) => {
          if (invitedUser.toString() === user._id.toString()) {
            inviteList.push({
              _id: user._id,
              username: user.username,
            });
          }
        });

        (room.blackList as string[]).forEach((bannedUserId) => {
          if (bannedUserId.toString() === user._id.toString()) {
            blackList.push({
              _id: user._id,
              username: user.username,
            });
          }
        });

        room.users.forEach((roomUser) => {
          if (roomUser._id?.toString() === user._id.toString()) {
            roomUser.username = user.username;
          }

          if (
            roomUser._id?.toString() === user._id.toString() &&
            roomUser.role !== "7610"
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (room as any)._doc.inviteList;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (room as any)._doc.blackList;
          }
        });
      });

      room.inviteList = inviteList;
      room.blackList = blackList;
    });

    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const userAcceptInvite = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId, body } = req;

  if (!body.roomId || !userId) throw createHttpError(406, "Missing data!");

  try {
    const isUserInRoom = await Room.findOne({
      "users.userId": new mongoose.Types.ObjectId(body.userId),
    });

    if (isUserInRoom) throw createHttpError(404, "user already joined");

    const invitedRoom = await Room.findOne({
      _id: new mongoose.Types.ObjectId(body.roomId),
    });

    if (!invitedRoom)
      throw createHttpError(404, "not found any room with this id");

    const foundedUser = await User.findOne({ _id: userId });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (invitedRoom as any)._doc.inviteList.remove([userId]);

    invitedRoom.users.push({
      userId,
      role: "7610",
      username: foundedUser?.username,
    });

    await invitedRoom.save();

    res.status(200).json({
      status: "success",
      message: "you accept the invite",
      room: invitedRoom,
    });
  } catch (error) {
    next(error);
  }
};

export const userIgnoreInvite = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId, body } = req;

  if (!body.roomId || !userId) throw createHttpError(406, "Missing data!");

  try {
    const invitedRoom = await Room.find({
      _id: new mongoose.Types.ObjectId(body.roomId),
    });

    if (!invitedRoom)
      throw createHttpError(404, "not found any room with this id");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (invitedRoom as any)[0]._doc.inviteList.remove([userId]);

    await invitedRoom[0].save();

    res.status(200).json({
      status: "success",
      message: "you ignore the invite",
      roomId: body.roomId,
    });
  } catch (error) {
    next(error);
  }
};

export const userSearch = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId, body } = req;

  if (!body.query || !body.roomId || !userId)
    throw createHttpError(406, "Missing data!");

  try {
    const inInviteListUsersID = await Room.find({
      _id: body.roomId,
    }).distinct("inviteList");

    const inRoomUsersID = await Room.find({ _id: body.roomId }).distinct(
      "users.userId"
    );

    const getInRoomUsersName = await User.find()
      .where("_id")
      .in([...inInviteListUsersID, ...inRoomUsersID])
      .distinct("userName")
      .exec();

    const foundedUsers = await User.find({
      $and: [
        { username: new RegExp(body.query, "i") },
        { username: { $not: { $in: getInRoomUsersName } } },
      ],
    }).select("username _id");

    if (foundedUsers.length === 0)
      throw createHttpError(404, "There Is No Users Matched");

    return res.status(201).json(foundedUsers);
  } catch (error) {
    next(error);
  }
};
