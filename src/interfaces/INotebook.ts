import mongoose from 'mongoose';

export interface INotebook {
  _id: string;
  owner: mongoose.ObjectId;
  name: string;
  notes: [string];
  subNotebook: [string];
}

export interface INotebookDTO {
  name: string;
}

export interface INotebookDeleteDTO {
  notebookID: string;
}
