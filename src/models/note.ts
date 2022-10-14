import { INote } from '@/interfaces/INote';
import mongoose from 'mongoose';
import User from '@/models/user';

const Note = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: User,
    },

    markdownNote: String,
  },
  { timestamps: true },
);

export default mongoose.model<INote & mongoose.Document>('Note', Note);
