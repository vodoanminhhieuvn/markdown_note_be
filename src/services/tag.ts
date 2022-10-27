import { Inject, Service } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { ITag, ITagDTO } from '@/interfaces/ITag';

@Service()
export default class TagService {
  constructor(
    @Inject('tagModel') private tagModel: Models.TagModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async CreateTag(
    tagDTO: ITagDTO,
    owner: string,
  ): Promise<{ tag: ITag }> {
    try {
      this.logger.silly('Creating tag record');
      const tagRecord = await this.tagModel.create({
        ...tagDTO,
        owner: owner,
      });

      if (!tagRecord) {
        return Promise.reject(Error("Can't create tag record"));
      }

      this.eventDispatcher.dispatch(events.tag.create, {
        tagID: tagRecord._id,
        owner: owner,
      });

      const tag = tagRecord;
      tag.owner = undefined;

      return { tag };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  public async GetTags(owner: string): Promise<{ listTag: ITag[] }> {
    this.logger.silly('Getting user tag records');
    const listTag = await this.tagModel.find(
      {
        owner: owner,
      },
      { owner: 0 },
    );

    return { listTag };
  }
}
