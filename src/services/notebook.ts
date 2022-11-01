import { Inject, Service } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { INotebook, INotebookDTO } from '@/interfaces/INotebook';
import { INote } from '@/interfaces/INote';

@Service()
export default class NotebookService {
  constructor(
    @Inject('notebookModel') private notebookModel: Models.NotebookModel,
    @Inject('noteModel') private noteModel: Models.NoteModel,
    // private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async CreateNotebook(
    notebookDTO: INotebookDTO,
    owner: string,
  ): Promise<{ notebook: INotebook }> {
    try {
      this.logger.silly('Creating user notebook record');
      const notebookRecord = await this.notebookModel.create({
        ...notebookDTO,
        owner: owner,
      });

      if (!notebookRecord) {
        return Promise.reject(Error("Can't create notebook record."));
      }

      this.eventDispatcher.dispatch(events.notebook.create, {
        noteBookID: notebookRecord._id,
        owner: owner,
      });

      const notebook = notebookRecord;
      notebook.owner = undefined;

      return { notebook };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async GetNotebook(
    owner: string,
  ): Promise<{ listNotebook: INotebook[] }> {
    this.logger.silly('Getting user notebook record');
    const listNotebook = await this.notebookModel.find(
      { owner: owner },
      { owner: 0 },
    );

    return { listNotebook };
  }

  public async GetNotes(noteBookID: string): Promise<{ listNote: INote[] }> {
    this.logger.silly('Getting user notes record in notebook');
    const notebookRecord = await this.notebookModel
      .findById(noteBookID)
      .populate<{ notes: INote[] }>({
        path: 'notes',
        options: {
          sort: { createdAt: -1 },
          populate: [
            { path: 'notebook', select: { _id: 1, name: 1 } },
            {
              path: 'tags',
              select: { _id: 1, name: 1, color: 1 },
            },
          ],
        },
      });

    const listNote = notebookRecord.notes;

    return { listNote };
  }

  public async DeleteNotebook(
    notebookID: string,
  ): Promise<{ success: boolean }> {
    this.logger.silly('Deleting user notebook records');

    const notebookRecord = await this.notebookModel.findById(notebookID);

    if (notebookRecord.notes)
      await this.noteModel.deleteMany({ _id: { $in: notebookRecord.notes } });

    notebookRecord.deleteOne();

    return { success: true };
  }
}
