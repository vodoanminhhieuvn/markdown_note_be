import { INotebook } from '@/interfaces/INotebook';
import mongoose from 'mongoose';

const Notebook = new mongoose.Schema(
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

    subNotebooks: [String],
  },
  { timestamps: true },
);

export default mongoose.model<INotebook & mongoose.Document>(
  'Notebook',
  Notebook,
);
