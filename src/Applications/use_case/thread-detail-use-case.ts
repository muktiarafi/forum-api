import { inject, injectable } from 'inversify';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

@injectable()
export class ThreadDetailUseCase {
  constructor(
    @inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository,
    @inject(TYPES.CommentRepository) public commentRepository: CommentRepository
  ) {}

  async execute(threadId: string) {
    const [thread, comments] = await Promise.all([
      this.threadRepository.getThread(threadId),
      this.commentRepository.getCommentsByThreadId(threadId),
    ]);
    thread.comments = comments;

    return thread;
  }
}
