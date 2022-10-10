import mongoose from 'mongoose';
export interface INoteBook {
  _id: string;
  owner: mongoose.ObjectId;
  name: string;
  notes: [string];
  subNoteBook: [string];
}

export interface INoteBookDTO {
  name: string;
}
