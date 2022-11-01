import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import middlewares from '../middlewares';
import { NoteBookController } from '../controllers';

const route = Router();

export default (app: Router) => {
  app.use('/notebook', route);

  route.post(
    '/create_notebook',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    NoteBookController.createNoteBook,
  );

  route.get(
    '/get_notebook',
    middlewares.isAuth,
    NoteBookController.getNoteBook,
  );

  route.get(
    '/get_notes',
    celebrate({
      [Segments.QUERY]: Joi.object({
        noteID: Joi.string().required(),
        noteName: Joi.string(),
      }),
    }),
    middlewares.isAuth,
    NoteBookController.getNotes,
  );

  route.post(
    '/delete_notebook',
    celebrate({
      [Segments.BODY]: Joi.object({
        notebookID: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    NoteBookController.deleteNotebook,
  );
};
