import mongoose from 'mongoose';

export interface INote {
  _id: string;
  owner: mongoose.ObjectId;
  name: string;
  markdownNote: string;
  noteBook: [string];
  tags: [string];
}

export interface INoteDTO {
  name: string;
  markdownNote?: string;
}

export interface INoteUpdateDTO {
  _id: string;
  name: string;
  markdownNote: string;
  noteBook: string;
}

export interface INoteUpdateNotebookDTO {
  noteID: string;
  notebookID: string;
}

export interface INoteUpdateStatusDTO {
  noteID: string;
  status: string;
}

export interface INoteUpdateTagsDTO {
  noteID: string;
  tags: [string];
}
