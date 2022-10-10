import mongoose from 'mongoose';
import config from '@/config';

export default async (): Promise<mongoose.Mongoose> => {
  // return connection.connection.db;

  return await mongoose.connect(config.databaseURL);
};
