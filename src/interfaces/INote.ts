import mongoose from 'mongoose';
export interface INote {
  _id: string;
  owner: mongoose.ObjectId;
  name: string;
  markdownNote: string;
}

export interface INoteDTO {
  name: string;
  markdownNote?: string;
}
