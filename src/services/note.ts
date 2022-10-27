import { Inject, Service } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import {
  INote,
  INoteDTO,
  INoteUpdateDTO,
  INoteUpdateNotebookDTO,
  INoteUpdateStatusDTO,
  INoteUpdateTagsDTO,
} from '@/interfaces/INote';

@Service()
export default class NoteService {
  constructor(
    @Inject('noteModel') private noteModel: Models.NoteModel,
    @Inject('noteBookModel') private noteBookModel: Models.NoteBookModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async CreateNote(
    noteDTO: INoteDTO,
    owner: string,
    noteBookID?: string,
  ): Promise<{ note: INote }> {
    try {
      this.logger.silly('Creating user note record');
      const noteRecord = await this.noteModel.create({
        ...noteDTO,
        owner: owner,
        noteBook: noteBookID,
      });

      if (!noteRecord) {
        return Promise.reject(Error("Can't create note record"));
      }

      this.eventDispatcher.dispatch(events.note.create, {
        noteBookID: noteBookID,
        noteID: noteRecord._id,
      });

      const note: INote = await noteRecord.populate({
        path: 'noteBook',
        select: { _id: 1, name: 1 },
      });
      note.owner = undefined;

      return { note };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async GetNotes(owner: string): Promise<{ listNote }> {
    this.logger.silly('Getting user note records');
    const listNote = await this.noteModel
      .find({ owner: owner }, { owner: 0 })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'noteBook', select: { _id: 1, name: 1 } },
        {
          path: 'tags',
          select: { _id: 1, name: 1, color: 1 },
        },
      ]);

    return { listNote };
  }

  public async UpdateNote(
    noteUpdateDTO: INoteUpdateDTO,
  ): Promise<{ success: boolean }> {
    try {
      this.logger.silly('Updating user note record');
      await this.noteModel.updateOne(
        { _id: noteUpdateDTO._id },
        {
          name: noteUpdateDTO.name,
          markdownNote: noteUpdateDTO.markdownNote,
          noteBook: noteUpdateDTO.noteBook,
        },
      );

      return { success: true };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async UpdateNoteBook(
    noteUpdateNotebookDTO: INoteUpdateNotebookDTO,
  ): Promise<{ success: boolean }> {
    try {
      this.logger.silly("Update note's notebook");
      const noteRecord: INote = await this.noteModel.findById(
        noteUpdateNotebookDTO.noteID,
      );

      this.eventDispatcher.dispatch(events.note.updateNotebook, {
        noteID: noteRecord._id.toString(),
        currentNotebookID: noteRecord.noteBook?.toString() || '',
        updateNotebookID: noteUpdateNotebookDTO.notebookID,
      });

      await this.noteModel.updateOne(
        { _id: noteRecord._id },
        {
          noteBook: noteUpdateNotebookDTO.notebookID,
        },
      );

      return { success: true };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async UpdateStatus(
    noteUpdateStatus: INoteUpdateStatusDTO,
  ): Promise<{ success: boolean }> {
    try {
      this.logger.silly("Update note's tag");
      await this.noteModel.findByIdAndUpdate(noteUpdateStatus.noteID, {
        status: noteUpdateStatus.status,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async UpdateTags(
    noteUpdateTagsDTO: INoteUpdateTagsDTO,
  ): Promise<{ success: boolean }> {
    try {
      this.logger.silly("Update note's tags");
      await this.noteModel.findByIdAndUpdate(noteUpdateTagsDTO.noteID, {
        $push: { tags: noteUpdateTagsDTO.tags },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
