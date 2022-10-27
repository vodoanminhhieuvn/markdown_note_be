import { Inject, Service } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { INoteBook, INoteBookDTO } from '@/interfaces/INoteBook';
import { INote } from '@/interfaces/INote';

@Service()
export default class NoteBookService {
  constructor(
    @Inject('noteBookModel') private noteBookModel: Models.NoteBookModel,
    // private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async CreateNoteBook(
    noteBookDTO: INoteBookDTO,
    owner: string,
  ): Promise<{ noteBook: INoteBook }> {
    try {
      this.logger.silly('Creating user notebook record');
      const noteBookRecord = await this.noteBookModel.create({
        ...noteBookDTO,
        owner: owner,
      });

      if (!noteBookRecord) {
        return Promise.reject(Error("Can't create notebook record."));
      }

      this.eventDispatcher.dispatch(events.noteBook.create, {
        noteBookID: noteBookRecord._id,
        owner: owner,
      });

      const noteBook = noteBookRecord;
      noteBook.owner = undefined;

      return { noteBook };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async GetNoteBook(
    owner: string,
  ): Promise<{ listNoteBook: INoteBook[] }> {
    this.logger.silly('Getting user notebook record');
    const listNoteBook = await this.noteBookModel.find(
      { owner: owner },
      { owner: 0 },
    );

    return { listNoteBook };
  }

  public async GetNotes(noteBookID: string): Promise<{ listNote: INote[] }> {
    this.logger.silly('Getting user notes record in notebook');
    const noteBookRecord = await this.noteBookModel
      .findById(noteBookID)
      .populate<{ notes: INote[] }>({
        path: 'notes',
        options: {
          sort: { createdAt: -1 },
          populate: [
            { path: 'noteBook', select: { _id: 1, name: 1 } },
            {
              path: 'tags',
              select: { _id: 1, name: 1, color: 1 },
            },
          ],
        },
      });

    const listNote = noteBookRecord.notes;

    return { listNote };
  }
}
