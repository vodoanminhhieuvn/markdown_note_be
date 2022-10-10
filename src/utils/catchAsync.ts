import { Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

const catchAsync = fn => (req: any, res: Response, next: NextFunction) => {
  const logger: Logger = Container.get('logger');
  Promise.resolve(fn(req, res, next)).catch(error => {
    logger.error('🔥 error: %o', error);
    return next({ success: false, error });
  });
};

export default catchAsync;
