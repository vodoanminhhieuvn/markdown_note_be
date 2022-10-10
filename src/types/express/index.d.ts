import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { INoteBook } from '@/interfaces/INoteBook';
import { INote } from '@/interfaces/INote';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type NoteBookModel = Model<INoteBook & Document>;
    export type NoteModel = Model<INote & Document>;
  }
}
