import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import mongoose from 'mongoose';
import { Logger } from 'winston';
import { INotebook } from '@/interfaces/INotebook';

@EventSubscriber()
export default class NoteSubscriber {
  @On(events.note.create)
  public async onNoteCreate({ notebookID, noteID }) {
    const Logger: Logger = Container.get('logger');

    if (notebookID == null) return;

    try {
      const NotebookModel = Container.get('notebookModel') as mongoose.Model<
        INotebook & mongoose.Document
      >;

      await NotebookModel.findOneAndUpdate(
        { _id: notebookID },
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
      const NotebookModel = Container.get('notebookModel') as mongoose.Model<
        INotebook & mongoose.Document
      >;

      if (currentNotebookID) {
        await NotebookModel.findOneAndUpdate(
          {
            _id: currentNotebookID,
          },
          {
            $pull: { notes: noteID },
          },
        ).exec();
      }

      await NotebookModel.findOneAndUpdate(
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
