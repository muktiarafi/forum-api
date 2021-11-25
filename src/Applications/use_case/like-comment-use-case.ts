import { inject, injectable } from 'inversify';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

export interface CommentUseCasePayload {
  userId: string;
  threadId: string;
  commentId: string;
}

@injectable()
export class LikeCommentUseCase {
  constructor(
    @inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository,
    @inject(TYPES.CommentRepository) public commentRepository: CommentRepository
  ) {}

  async execute(payload: CommentUseCasePayload) {
    const { userId, threadId, commentId } = payload;

    await this.threadRepository.isThreadAvailable(threadId);
    await this.commentRepository.isCommentAvailable(commentId);

    const isLiked = await this.commentRepository.isLiked(userId, commentId);

    if (isLiked) {
      await this.commentRepository.deleteLike(userId, commentId);
    } else {
      await this.commentRepository.addLike(userId, commentId);
    }
  }
}
