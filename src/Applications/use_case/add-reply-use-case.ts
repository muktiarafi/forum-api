import { inject, injectable } from 'inversify';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { NewReply } from '../../Domains/comments/entities/new-reply';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

export interface AddReplyUseCasePayload {
  userId: string;
  threadId: string;
  parentId: string;
  content: string;
}

@injectable()
export class AddReplyUseCase {
  constructor(
    @inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository,
    @inject(TYPES.CommentRepository) public commentRepository: CommentRepository
  ) {}

  async execute(payload: AddReplyUseCasePayload) {
    const { userId, threadId, parentId, content } = payload;
    const newReply = new NewReply({
      userId,
      threadId,
      parentId,
      content,
    });

    await this.threadRepository.isThreadAvailable(threadId);
    await this.commentRepository.checkExistance(parentId);

    return this.commentRepository.addReply(newReply);
  }
}
