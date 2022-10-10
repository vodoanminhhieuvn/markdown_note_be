import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import noteBook from './routes/noteBook';
import note from './routes/note';
import agendash from './routes/agendash';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  noteBook(app);
  note(app);
  agendash(app);

  return app;
};
