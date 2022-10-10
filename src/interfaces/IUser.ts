import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  noteBooks: string[];
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
