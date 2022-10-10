import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import mongoose from 'mongoose';
import { Logger } from 'winston';
import { INoteBook } from '@/interfaces/INoteBook';

@EventSubscriber()
export default class NoteSubscriber {
  @On(events.note.create)
  public async onNoteCreate({ noteBookID, noteID }) {
    const Logger: Logger = Container.get('logger');

    if (noteBookID == null) return;

    try {
      const NoteBookModel = Container.get('noteBookModel') as mongoose.Model<
        INoteBook & mongoose.Document
      >;

      await NoteBookModel.findOneAndUpdate(
        { _id: noteBookID },
        { $push: { notes: noteID } },
      );
    } catch (error) {
      Logger.error(`🔥 Error on event ${events.user.signIn}: %o`, error);

      // Throw the error so the process die (check src/app.ts)
      throw error;
    }
  }
}
