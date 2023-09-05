import { NextFunction, RequestHandler, Response } from "express";
import { IRequest } from "../middleware/verifyJWT";
import Room from "../schemas/Room";
import createHttpError from "http-errors";
import Message from "../schemas/Message";

export const getAllRoomsMessages = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  if (!userId) throw createHttpError(406, "Missing data!");

  try {
    const rooms = await Room.find({
      "users.userId": userId,
    }).distinct("_id");

    const messages = await Message.find({ roomId: { $in: rooms } });

    if (!messages) throw createHttpError(404, "no message");

    return res.status(201).json(messages);
  } catch (error) {
    next(error);
  }
};

export const getRoomMessages: RequestHandler = async (req, res, next) => {
  const { roomId } = req.params;

  if (!roomId) throw createHttpError(406, "Missing data!");

  try {
    const messages = await Message.find({ roomId });

    if (!messages) throw createHttpError(404, "no message found!");

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const addMessage = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { body, userId: senderId, username } = req;

  const { roomId } = req.params;

  if (!roomId || !username || !senderId || !body)
    throw createHttpError(406, "Missing data!");

  try {
    const isUserInRoom = await Room.find({
      "users.userId": senderId,
      _id: roomId,
    });

    if (isUserInRoom.length === 0)
      throw createHttpError(403, "you aren't on this room!");

    const newMessage = new Message({
      img: body.img,
      message: body.message,
      senderId,
      senderName: username,
      roomId,
    });

    if (!newMessage) throw createHttpError(500, "cant send the message");

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const uploadMessageImg: RequestHandler = (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw createHttpError(400, "Please upload a file");
    }
    return res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};
