import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';
//We have to import at least all the events once, so they can be triggered
import './events';

export default async ({ expressApp }) => {
  const mongoConnection = await (await mongooseLoader()).connection.db;

  Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const userModel = {
    name: 'userModel',
    // Notice the requirement syntax and the '.default'
    model: require('../models/user').default,
  };

  const noteBookModel = {
    name: 'noteBookModel',
    model: require('../models/noteBook').default,
  };

  const noteModel = {
    name: 'noteModel',
    model: require('../models/note').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = dependencyInjectorLoader({
    mongoConnection,
    models: [
      userModel,
      noteBookModel,
      noteModel,
      // salaryModel,
      // whateverModel
    ],
  });

  Logger.info('✌️ Dependency Injector loaded');

  await jobsLoader({ agenda });
  Logger.info('✌️ Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
