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
      Logger.error(`🔥 Error on event ${events.note.create}: %o`, error);

      // Throw the error so the process die (check src/app.ts)
      throw error;
    }
  }

  @On(events.note.updateNotebook)
  public async onUpdateNotebook({
    noteID,
    currentNotebookID,
    updateNotebookID,
  }) {
    const logger: Logger = Container.get('logger');

    if (updateNotebookID == null || currentNotebookID == updateNotebookID)
      return;

    try {
      const NoteBookModel = Container.get('noteBookModel') as mongoose.Model<
        INoteBook & mongoose.Document
      >;

      if (currentNotebookID) {
        await NoteBookModel.findOneAndUpdate(
          {
            _id: currentNotebookID,
          },
          {
            $pull: { notes: noteID },
          },
        ).exec();
      }

      await NoteBookModel.findOneAndUpdate(
        {
          _id: updateNotebookID,
        },
        {
          $push: { notes: noteID },
        },
      );

      console.log('Printing', currentNotebookID, ':', updateNotebookID);
    } catch (error) {
      logger.error(
        `🔥 Error on event ${events.note.updateNotebook}: %o`,
        error,
      );

      throw error;
    }
  }
}
