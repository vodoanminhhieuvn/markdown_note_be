import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import middlewares from '../middlewares';
import { NoteController } from '../controllers';

const route = Router();

export default (app: Router) => {
  app.use('/note', route);

  route.post(
    '/create_note',
    celebrate({
      [Segments.BODY]: Joi.object({
        note: Joi.object({
          name: Joi.string().allow(''),
          markdownNote: Joi.string().allow(''),
        }).required(),
        notebookID: Joi.string(),
      }),
    }),
    middlewares.isAuth,
    NoteController.createNote,
  );

  route.get('/get_notes', middlewares.isAuth, NoteController.getNotes);

  route.get('/get_notes_by_filter', middlewares.isAuth);

  route.put(
    '/update_note',
    celebrate({
      [Segments.BODY]: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().allow(''),
        markdownNote: Joi.string().allow(''),
      }),
    }),
    middlewares.isAuth,
    NoteController.updateNotes,
  );

  route.put(
    '/update_notebook',
    celebrate({
      [Segments.BODY]: Joi.object({
        noteID: Joi.string().required(),
        notebookID: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    NoteController.updateNotebook,
  );

  route.put(
    '/update_status',
    celebrate({
      [Segments.BODY]: Joi.object({
        noteID: Joi.string().required(),
        status: Joi.string(),
      }),
    }),
    middlewares.isAuth,
    NoteController.updateStatus,
  );

  route.put(
    '/update_tags',
    celebrate({
      [Segments.BODY]: Joi.object({
        noteID: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
      }),
    }),
    middlewares.isAuth,
    NoteController.updateTags,
  );

  route.post(
    '/delete_note',
    celebrate({
      [Segments.BODY]: Joi.object({
        noteID: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    NoteController.deleteNote,
  );
};
