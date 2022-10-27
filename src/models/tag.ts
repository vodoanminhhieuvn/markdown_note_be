import { ITag } from '@/interfaces/ITag';
import mongoose from 'mongoose';

const Tag = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      default: 'custom',
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    color: {
      type: String,
      default: '#ffffff',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITag & mongoose.Document>('Tag', Tag);
