export interface IMessage {
  _id: string;
  message: string;
  senderId: string;
  senderName: string;
  roomId: string;
  createdAt: Date;
  updateAt: Date;
  img: string;
}

export interface IUserSendMessage {
  roomId: string;
  message: string;
  img: string;
}

export interface ImgInfo {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
