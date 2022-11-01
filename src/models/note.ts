import { INote } from '@/interfaces/INote';
import mongoose from 'mongoose';

const Note = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      default: '',
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    markdownNote: {
      type: String,
      default: '',
    },

    notebook: {
      type: mongoose.Types.ObjectId,
      ref: 'Notebook',
    },

    status: {
      type: String,
      default: '',
      enum: ['', 'Active', 'On Hold', 'Completed', 'Dropped'],
    },

    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<INote & mongoose.Document>('Note', Note);
