import { Container } from 'typedi';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import { Logger } from 'winston';
import {
  INoteDeleteDTO,
  INoteDTO,
  INoteUpdateDTO,
  INoteUpdateNotebookDTO,
  INoteUpdateStatusDTO,
  INoteUpdateTagsDTO,
} from '@/interfaces/INote';
import NoteService from '@/services/note';

const createNote = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Create-Note endpoint with body: %o', req.body);

  const noteDTO: INoteDTO = req.body['note'];
  const owner: string = req['auth']._id;
  const noteBookID: string = req.body['noteBookID'];

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

  return res.json(success).status(200);
});

const updateNotebook = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Update-Notebook endpoint with body: %o', req.body);

  const noteUpdateNotebookDTO: INoteUpdateNotebookDTO = req.body;

  const noteService = Container.get(NoteService);
  const { success } = await noteService.UpdateNoteBook(noteUpdateNotebookDTO);

  return res.json(success).status(200);
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Update-Status endpoint with body: %o', req.body);

  const noteUpdateStatusDTO: INoteUpdateStatusDTO = req.body;

  const noteService = Container.get(NoteService);
  const { success } = await noteService.UpdateStatus(noteUpdateStatusDTO);

  return res.json(success).status(200);
});

const updateTags = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Update-Tags endpoint with body: %o', req.body);

  const noteUpdateTagsDTO: INoteUpdateTagsDTO = req.body;

  const noteService = Container.get(NoteService);

  const { success } = await noteService.UpdateTags(noteUpdateTagsDTO);

  return res.json(success).status(200);
});

const deleteNote = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Deleting-Tags endpoint with body: %o', req.body);

  const noteDeleteDTO: INoteDeleteDTO = req.body;

  const noteService = Container.get(NoteService);

  const { result } = await noteService.DeleteNote(noteDeleteDTO.noteID);

  return res.json(result).status(200);
});

export default {
  createNote,
  getNotes,
  updateNotes,
  updateNotebook,
  updateStatus,
  updateTags,
  deleteNote,
};
