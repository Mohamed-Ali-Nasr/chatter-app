import { IRoomSchema } from "../schemas/Room";

export const kickUser = async (room: IRoomSchema, userId: string) => {
  room.users.filter((user) => user._id !== userId);

  let isSave = false;

  if (await room.save()) isSave = true;
  else isSave = false;

  return isSave;
};
