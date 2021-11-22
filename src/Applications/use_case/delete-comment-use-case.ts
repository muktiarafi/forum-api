import { inject, injectable } from 'inversify';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

export interface DeleteCommentUseCasePayload {
  userId: string;
  threadId: string;
  commentId: string;
}

@injectable()
export class DeleteCommentUseCase {
  constructor(
    @inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository,
    @inject(TYPES.CommentRepository) public commentRepository: CommentRepository
  ) {}

  async execute({ userId, threadId, commentId }: DeleteCommentUseCasePayload) {
    await this.threadRepository.getThread(threadId);
    await this.commentRepository.checkOwnership(userId, commentId);
    await this.commentRepository.deleteComment(commentId);
  }
}
