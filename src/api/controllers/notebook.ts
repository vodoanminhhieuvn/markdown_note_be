import { Container } from 'typedi';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import NoteBookService from '@/services/noteBook';
import { INoteBookDTO } from '@/interfaces/INoteBook';
import { Logger } from 'winston';
import pick from '@/utils/pick';

const createNoteBook = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Create-Note-Book endpoint with body: %o', req.body);

  const noteBookDTO: INoteBookDTO = req.body as INoteBookDTO;
  const owner = req['auth']._id;

  const noteBookService = Container.get(NoteBookService);
  const { noteBook } = await noteBookService.CreateNoteBook(noteBookDTO, owner);

  return res.json(noteBook).status(200);
});

const getNoteBook = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Get-Note-Book endpoint with body: %o', req.body);

  const owner = req['auth']._id;
  const noteBookService = Container.get(NoteBookService);
  const { listNoteBook } = await noteBookService.GetNoteBook(owner);

  return res.json(listNoteBook).status(200);
});

const getNotes = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Get-Notes endpoint with body: %o', req.body);

  const filter = pick(req.query, ['noteID', 'noteName']);
  const noteBookID = filter['noteID'] as string;

  const noteBookService = Container.get(NoteBookService);
  const { listNote } = await noteBookService.GetNotes(noteBookID);

  return res.json(listNote).status(200);
});

export default {
  createNoteBook,
  getNoteBook,
  getNotes,
};
