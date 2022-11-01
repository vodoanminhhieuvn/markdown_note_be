import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { INotebook } from '@/interfaces/INotebook';
import { INote } from '@/interfaces/INote';
import { ITag } from '@/interfaces/ITag';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type NotebookModel = Model<INotebook & Document>;
    export type NoteModel = Model<INote & Document>;
    export type TagModel = Model<ITag & Document>;
  }
}
