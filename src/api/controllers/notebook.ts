import { Container } from 'typedi';
import { Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import NoteBookService from '@/services/noteBook';
import { INoteBookDTO } from '@/interfaces/INoteBook';

const createNoteBook = catchAsync(async (req: any, res: Response) => {
  const noteBookDTO: INoteBookDTO = req.body as INoteBookDTO;
  const owner = req.auth._id;

  const noteBookService = Container.get(NoteBookService);
  const { noteBook } = await noteBookService.CreateNoteBook(noteBookDTO, owner);

  return res.json(noteBook).status(200);
});

const getNoteBook = catchAsync(async (req: any, res: Response) => {
  const owner = req.auth._id;
  const noteBookService = Container.get(NoteBookService);
  const { listNoteBook } = await noteBookService.GetNoteBook(owner);

  return res.json(listNoteBook).status(200);
});

export default {
  createNoteBook,
  getNoteBook,
};
