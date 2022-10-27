import { INoteBook } from '@/interfaces/INoteBook';
import mongoose from 'mongoose';

const NoteBook = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    notes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Note',
      },
    ],

    subNoteBooks: [String],
  },
  { timestamps: true },
);

export default mongoose.model<INoteBook & mongoose.Document>(
  'NoteBook',
  NoteBook,
);
