import { Container } from 'typedi';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import { INoteDTO, INoteUpdateDTO } from '@/interfaces/INote';
import NoteService from '@/services/note';
import { Logger } from 'winston';

const createNote = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Create-Note endpoint with body: %o', req.body);

  const noteDTO: INoteDTO = req.body['note'];
  const owner = req['auth']._id;
  const noteBookID = req.body['noteBookID'];

  const noteService = Container.get(NoteService);
  const { note } = await noteService.CreateNote(noteDTO, owner, noteBookID);

  return res.json(note).status(200);
});

const getNotes = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Get-Notes endpoint with body: %o', req.body);

  const owner = req['auth']._id;

  const noteService = Container.get(NoteService);
  const { listNote } = await noteService.GetNotes(owner);

  return res.json(listNote).status(200);
});

const updateNotes = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Update-Note endpoint with body: %o', req.body);

  const noteUpdateDTO: INoteUpdateDTO = req.body;

  const noteService = Container.get(NoteService);
  const { success } = await noteService.UpdateNote(noteUpdateDTO);

  return res.json({ success }).status(200);
});

export default {
  createNote,
  getNotes,
  updateNotes,
};
