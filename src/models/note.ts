import { INote } from '@/interfaces/INote';
import mongoose from 'mongoose';

const Note = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a note name'],
      index: true,
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },

    markdownNote: String,
  },
  { timestamps: true },
);

export default mongoose.model<INote & mongoose.Document>('Note', Note);
