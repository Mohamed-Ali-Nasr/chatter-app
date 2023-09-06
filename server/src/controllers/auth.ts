import "dotenv/config";
import bcrypt from "bcrypt";
import { CookieOptions, RequestHandler } from "express";
import User from "../schemas/User";
import createHttpError from "http-errors";
import { generateTokens } from "../utils/generateTokens";
import { createTokenOptions } from "../utils/cookies";
import JWT from "jsonwebtoken";
import env from "../utils/validateEnv";

interface RegisterBody {
  email: string;
  password: string;
  username: string;
}

export const register: RequestHandler<
  unknown,
  unknown,
  RegisterBody,
  unknown
> = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser)
      throw createHttpError(
        400,
        "User already exists. Please choose a different one or log in instead."
      );

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ status: "success", message: "new user created" });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select("+password +email")
      .exec();

    if (!user) throw createHttpError(400, "Invalid email or password.");

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid)
      throw createHttpError(400, "Invalid email or password.");

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("jwt", refreshToken, {
      ...createTokenOptions(),
      maxAge: 24 * 60 * 60 * 1000,
    } as CookieOptions);

    res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt as string;

  if (refreshToken) {
    JWT.verify(refreshToken, env.REFRESH_TOKEN, async (error, decode) => {
      if (error) {
        throw createHttpError(403, "Forbidden");
      } else {
        const user = await User.findOne({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _id: (decode as any).id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          username: (decode as any).username,
        }).exec();

        if (!user) throw createHttpError(401, "Unauthorized");

        const { accessToken } = await generateTokens(user);

        res.status(201).json({ accessToken });
      }
    });
  } else {
    next(createHttpError(401, "User not authenticated"));
  }
};

export const logout: RequestHandler = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie("jwt", {
    path: "/",
    secure: false,
    httpOnly: false,
    sameSite: true,
    maxAge: 0,
  } as CookieOptions);

  res.sendStatus(200);
};
