import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import env from "./utils/validateEnv";
import createHttpError, { isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions";
import { credentials } from "./middleware/credentials";
import Logging from "./utils/logging";
import routes from "./routes";
import { Server } from "socket.io";
import { IUser } from "./types/IUser";
import Room from "./schemas/Room";
import { IMessage } from "./types/IMessage";
import { InviteData } from "./types/IRoom";
import path from "path";

/* Configuration */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(credentials);

/* Creating Server */
const PORT = env.PORT;

const server = http.createServer(app).listen(PORT, () => {
  Logging.log(`Server running on port: ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: env.FRONT_END_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userId: string) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (roomId: string) => {
    socket.join(roomId);
    console.log(`user joined new room with id ${roomId}`);
  });

  socket.on(
    "new message",
    (receiveData: { users: IUser[]; messageData: IMessage }) => {
      const { users, messageData } = receiveData;

      if (!users) return console.log("chat.users not defined");

      users.forEach((user) => {
        if (user?.userId !== (messageData.senderId as string)) {
          console.log(`i send message to ${user.userId}`);
          socket.broadcast
            .to(user.userId!)
            .emit("new message", { ...messageData });
        }
      });
    }
  );

  socket.on(
    "send invite",
    (receiveData: { inviteData: InviteData; roomName: string }) => {
      const inviteData = receiveData.inviteData;
      const roomId = receiveData.inviteData.roomId;
      const roomName = receiveData.roomName;

      if (inviteData.id) {
        socket
          .in(inviteData.id)
          .emit("get invite for user", { _id: roomId, name: roomName });
      }
    }
  );

  socket.on("user kick", (receiveData: { RoomId: string; userId: string }) => {
    const { RoomId, userId } = receiveData;

    socket.in(userId).emit("user kicked", RoomId);
  });

  socket.on(
    "remove from room invite list",
    async (receiveData: { roomId: string; userId: string }) => {
      const { roomId, userId } = receiveData;

      const foundedRoom = await Room.findOne({ _id: roomId });

      foundedRoom?.users.forEach((user) => {
        if (user.userId !== userId) {
          socket
            .to(user.userId!)
            .emit("user removed from room invite list", { roomId, userId });
        }
      });
    }
  );

  socket.on(
    "user accept invite",
    async (receiveData: {
      roomId: string;
      userId: string;
      username: string;
    }) => {
      const { roomId, userId, username } = receiveData;

      const foundedRoom = await Room.findOne({ _id: roomId });

      foundedRoom?.users.forEach((user) => {
        if (user.userId !== userId) {
          socket
            .to(user.userId!)
            .emit("user joined room", { roomId, userId, username });
        }
      });
    }
  );

  socket.on(
    "admin cancel invite",
    (receiveData: { roomId: string; userId: string }) => {
      const { roomId, userId } = receiveData;

      socket.to(userId).emit("invite canceled by admin", roomId);
    }
  );

  socket.on(
    "ban user",
    (receiveData: { roomId: string; userId: string; roomName: string }) => {
      const { roomId, userId, roomName } = receiveData;

      socket.to(userId).emit("banned by admin", { roomId, roomName });
    }
  );

  socket.on(
    "delete room",
    async (receiveData: {
      roomId: string;
      myId: string;
      roomName: string;
      roomUsers: IUser[];
    }) => {
      const { roomName, roomId, roomUsers, myId } = receiveData;

      roomUsers.forEach((user) => {
        if (user.userId !== myId) {
          console.log(
            `user with id ${myId} delete room with name ${roomName} && id ${roomId}`
          );
          socket.to(user.userId!).emit("remove room", { roomId, roomName });
        }
      });
    }
  );

  socket.on(
    "change room name",
    (receiveData: {
      roomId: string;
      myId: string;
      roomUsers: IUser[];
      newRoomName: string;
    }) => {
      const { newRoomName, roomId, roomUsers, myId } = receiveData;

      roomUsers.forEach((user) => {
        if (user.userId !== myId) {
          socket
            .to(user.userId!)
            .emit("room name changed", { roomId, newRoomName });
        }
      });
    }
  );

  socket.on(
    "user leave the room",
    (receiveData: { roomId: string; userId: string; roomUsers: IUser[] }) => {
      const { roomId, roomUsers, userId } = receiveData;

      roomUsers.forEach((user) => {
        if (user.userId !== userId) {
          socket
            .to(user.userId!)
            .emit("user leave the room", { roomId, userId });
        }
      });
    }
  );
});

/* Mongoose Setup */
mongoose.Promise = Promise;
mongoose
  .connect(env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    Logging.info("Connected to MongoDB");
  })
  .catch((error) => {
    Logging.error("Unable to connect to Mongo : ");
    Logging.error(error);
  });
mongoose.connection.on("error", (error: Error) => console.log(error));

/* Routes */
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api", routes());

app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/* Error Handling */
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});
