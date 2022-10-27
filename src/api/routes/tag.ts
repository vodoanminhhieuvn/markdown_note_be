import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import middlewares from '../middlewares';
import { TagController } from '../controllers';

const route = Router();

export default (app: Router) => {
  app.use('/tag', route);

  route.post(
    '/create_tag',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string(),
        color: Joi.string(),
      }),
    }),
    middlewares.isAuth,
    TagController.createTag,
  );

  route.get('/get_tags', middlewares.isAuth, TagController.getTags);
};
