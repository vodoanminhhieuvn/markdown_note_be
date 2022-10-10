import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req: any, res: any, next: any) => {
  const Logger: Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<
      IUser & mongoose.Document
    >;
    const userRecord = await UserModel.findById(req.auth._id);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    const currentUser = userRecord;
    currentUser.password = undefined;
    currentUser.salt = undefined;
    req.currentUser = currentUser;

    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
