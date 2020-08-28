import { Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  author: string;
  date: Date;
  category: string;
  hidden: boolean;
}

export interface IMessage extends Document {
  body: string;
  seen: boolean;
  date: Date;
  sender: IUser['_id'];
  recipient: IUser['_id'];
}

export interface INotification extends Document {
  type: string;
  message: string;
  read: boolean;
  user: IUser['_id'];
}

export interface IUser extends Document {
  authID: string;
  displayName: string;
  role: string;
}