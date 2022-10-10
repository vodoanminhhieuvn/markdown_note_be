import { Container } from 'typedi';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import { INoteDTO } from '@/interfaces/INote';
import NoteService from '@/services/note';

const createNote = catchAsync(async (req: Request, res: Response) => {
  const noteDTO: INoteDTO = req.body['note'];
  const owner = req['auth']._id;
  const noteBookID = req.body['noteBookID'];

  const noteService = Container.get(NoteService);
  const { note } = await noteService.CreateNote(noteDTO, owner, noteBookID);

  return res.json(note).status(200);
});

const getNotes = catchAsync(async (req: Request, res: Response) => {
  const owner = req['auth']._id;

  const noteService = Container.get(NoteService);
  const { listNote } = await noteService.GetNotes(owner);

  return res.json(listNote).status(200);
});

export default {
  createNote,
  getNotes,
};
