import "dotenv/config";
import jwt from "jsonwebtoken";
import UserToken from "../schemas/UserToken";
import env from "./validateEnv";
import { IUserSchema } from "../schemas/User";

export const generateTokens = async (
  user: IUserSchema
): Promise<{ accessToken?: string; refreshToken?: string; err?: Error }> => {
  try {
    const payload = { id: user._id, username: user.username };

    const accessToken = jwt.sign(payload, env.ACCESS_TOKEN, {
      expiresIn: "15h",
    });

    const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });

    const userToken = await UserToken.findOne({ userId: user._id });

    if (userToken) await userToken.deleteOne();

    await new UserToken({ userId: user._id, token: refreshToken }).save();

    return { accessToken, refreshToken };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return err;
  }
};
