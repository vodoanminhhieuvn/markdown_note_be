import { Container } from 'typedi';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import { INotebookDeleteDTO, INotebookDTO } from '@/interfaces/INotebook';
import { Logger } from 'winston';
import pick from '@/utils/pick';
import NotebookService from '@/services/notebook';

const createNoteBook = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Create-Note-Book endpoint with body: %o', req.body);

  const noteBookDTO: INotebookDTO = req.body as INotebookDTO;
  const owner = req['auth']._id;

  const noteBookService = Container.get(NotebookService);
  const { notebook } = await noteBookService.CreateNotebook(noteBookDTO, owner);

  return res.json(notebook).status(200);
});

const getNoteBook = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Get-Note-Book endpoint with body: %o', req.body);

  const owner = req['auth']._id;
  const noteBookService = Container.get(NotebookService);
  const { listNotebook } = await noteBookService.GetNotebook(owner);

  return res.json(listNotebook).status(200);
});

const getNotes = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Get-Notes endpoint with body: %o', req.body);

  const filter = pick(req.query, ['noteID', 'noteName']);
  const noteBookID = filter['noteID'] as string;

  const noteBookService = Container.get(NotebookService);
  const { listNote } = await noteBookService.GetNotes(noteBookID);

  return res.json(listNote).status(200);
});

const deleteNotebook = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Delete-Notes endpoint with body: %o', req.body);

  const notebookDeleteDTO: INotebookDeleteDTO = req.body;

  const noteBookService = Container.get(NotebookService);
  const { success } = await noteBookService.DeleteNotebook(
    notebookDeleteDTO.notebookID,
  );

  return res.json(success).status(200);
});

export default {
  createNoteBook,
  getNoteBook,
  getNotes,
  deleteNotebook,
};
