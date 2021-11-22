import { inject, injectable } from 'inversify';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { NewComment } from '../../Domains/comments/entities/new-comment';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

export interface AddCommentUseCasePayload {
  userId: string;
  threadId: string;
  content: string;
}

@injectable()
export class AddCommentUseCase {
  constructor(
    @inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository,
    @inject(TYPES.CommentRepository) public commentRepository: CommentRepository
  ) {}

  async execute(payload: AddCommentUseCasePayload) {
    const { userId, threadId, content } = payload;
    const newComment = new NewComment({
      userId,
      threadId,
      content,
    });

    await this.threadRepository.isThreadAvailable(threadId);

    return this.commentRepository.addComment(newComment);
  }
}
