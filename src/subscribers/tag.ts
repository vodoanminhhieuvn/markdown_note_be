import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import mongoose from 'mongoose';
import { Logger } from 'winston';
import { IUser } from '@/interfaces/IUser';

@EventSubscriber()
export default class TagSubscriber {
  @On(events.tag.create)
  public async onTagCreate({ tagID, owner }) {
    const logger: Logger = Container.get('logger');

    try {
      const UserModel = Container.get('userModel') as mongoose.Model<
        IUser & mongoose.Document
      >;

      await UserModel.findOneAndUpdate(
        { _id: owner },
        { $push: { tags: tagID } },
      );
    } catch (error) {
      logger.error(`🔥 Error on event ${events.tag.create}: %o`, error);
    }
  }
}
