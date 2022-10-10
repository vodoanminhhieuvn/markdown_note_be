import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import middlewares from '../middlewares';
import { NoteBookController } from '../controllers';

const route = Router();

export default (app: Router) => {
  app.use('/notebook', route);

  route.post(
    '/create_note_book',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    NoteBookController.createNoteBook,
  );

  route.get(
    '/get_note_book',
    middlewares.isAuth,
    NoteBookController.getNoteBook,
  );
};
