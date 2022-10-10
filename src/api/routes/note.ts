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
          name: Joi.string().required(),
          markdownNote: Joi.string(),
        }).required(),
        noteBookID: Joi.string(),
      }),
    }),
    middlewares.isAuth,
    NoteController.createNote,
  );

  route.get('/get_notes', middlewares.isAuth, NoteController.getNotes);
};
