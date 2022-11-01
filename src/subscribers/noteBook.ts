import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import mongoose from 'mongoose';
import { Logger } from 'winston';
import { IUser } from '@/interfaces/IUser';

@EventSubscriber()
export default class NotebookSubscriber {
  @On(events.notebook.create)
  public async onNotebookCreate({ noteBookID, owner }) {
    const logger: Logger = Container.get('logger');

    try {
      const UserModel = Container.get('userModel') as mongoose.Model<
        IUser & mongoose.Document
      >;

      await UserModel.findOneAndUpdate(
        { _id: owner },
        { $push: { noteBooks: noteBookID } },
      );
    } catch (e) {
      logger.error(`🔥 Error on event ${events.notebook.create}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }
}
