import mongoose from 'mongoose';

export interface ITag {
  _id: string;
  name: string;
  color: string;
  owner: mongoose.ObjectId;
}

export interface ITagDTO {
  name: string;
  color: string;
}

export interface ITagUpdateDTO {
  name: string;
  color: string;
}

export interface ITagDeleteDTO {
  tagID: string;
}
