import { Inject, Service } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { INote, INoteDTO, INoteUpdateDTO } from '@/interfaces/INote';

@Service()
export default class NoteService {
  constructor(
    @Inject('noteModel') private noteModel: Models.NoteModel,
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
      });

      if (!noteRecord) {
        return Promise.reject(Error("Can't create note record"));
      }

      this.eventDispatcher.dispatch(events.note.create, {
        noteBookID: noteBookID,
        noteID: noteRecord._id,
      });

      const note = noteRecord;
      note.owner = undefined;

      return { note };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async GetNotes(owner: string): Promise<{ listNote: INote[] }> {
    this.logger.silly('Getting user note records');
    const listNote = await this.noteModel.find({ owner: owner }, { owner: 0 });

    return { listNote };
  }

  public async UpdateNote(
    noteUpdateDTO: INoteUpdateDTO,
  ): Promise<{ success: boolean }> {
    try {
      this.logger.silly('Updating user note record');
      await this.noteModel.updateOne(
        { _id: noteUpdateDTO._id },
        { markdownNote: noteUpdateDTO.markdownNote },
      );

      return { success: true };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
