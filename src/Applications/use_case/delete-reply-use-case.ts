import { inject, injectable } from 'inversify';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

export interface DeleteReplyUseCasePayload {
  userId: string;
  threadId: string;
  commentId: string;
  replyId: string;
}

@injectable()
export class DeleteReplyUseCase {
  constructor(
    @inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository,
    @inject(TYPES.CommentRepository) public commentRepository: CommentRepository
  ) {}

  async execute(payload: DeleteReplyUseCasePayload) {
    const { userId, threadId, commentId, replyId } = payload;

    await this.threadRepository.getThread(threadId);
    await this.commentRepository.checkExistance(commentId);
    await this.commentRepository.checkOwnership(userId, replyId);
    await this.commentRepository.deleteComment(replyId);
  }
}
