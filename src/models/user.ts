import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';
import NoteBook from '@/models/noteBook';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      default: 'users',
    },

    noteBooks: [
      {
        type: mongoose.Types.ObjectId,
        ref: NoteBook,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
