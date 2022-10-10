import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import mongoose from 'mongoose';
import { Logger } from 'winston';
import { IUser } from '@/interfaces/IUser';

@EventSubscriber()
export default class NoteBookSubscriber {
  @On(events.noteBook.create)
  public async onNoteBookCreate({ noteBookID, owner }) {
    const Logger: Logger = Container.get('logger');

    try {
      const UserModel = Container.get('userModel') as mongoose.Model<
        IUser & mongoose.Document
      >;

      await UserModel.findOneAndUpdate(
        { _id: owner },
        { $push: { noteBooks: noteBookID } },
      );
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signIn}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }
}
