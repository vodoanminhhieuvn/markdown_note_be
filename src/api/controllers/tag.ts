import { Container } from 'typedi';
import { Request, Response } from 'express';
import catchAsync from '@/utils/catchAsync';
import { Logger } from 'winston';
import { ITagDeleteDTO, ITagDTO } from '@/interfaces/ITag';
import TagService from '@/services/tag';

const createTag = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Create-Tag endpoint with body: %o', req.body);

  const tagDTO: ITagDTO = req.body;
  const owner: string = req['auth']._id;

  const tagService = Container.get(TagService);
  const { tag } = await tagService.CreateTag(tagDTO, owner);

  return res.json(tag).status(200);
});

const getTags = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Get-Tags endpoint with body: %o', req.body);

  const owner: string = req['auth']._id;

  const tagService = Container.get(TagService);
  const { listTag } = await tagService.GetTags(owner);

  return res.json(listTag).status(200);
});

const deleteTag = catchAsync(async (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Delete-Tags endpoint with body: %o', req.body);

  const tagDeleteDTO: ITagDeleteDTO = req.body;
  const owner: string = req['auth']._id;

  const tagService = Container.get(TagService);
  const { result } = await tagService.DeleteTag(tagDeleteDTO.tagID, owner);

  return res.json(result).status(200);
});

export default {
  createTag,
  getTags,
  deleteTag,
};
