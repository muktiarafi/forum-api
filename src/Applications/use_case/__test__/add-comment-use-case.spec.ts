import { CommentRepository } from '../../../Domains/comments/comment-repository';
import { AddedComment } from '../../../Domains/comments/entities/added-comment';
import { NewComment } from '../../../Domains/comments/entities/new-comment';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { AddCommentUseCase } from '../add-comment-use-case';

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      threadId: 'thread-1',
      content: 'content',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-1',
      content: 'content',
      owner: 'user-1',
    });

    const mockThreadRepository = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepository.isThreadAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

    const addCommentUseCase = new AddCommentUseCase(mockThreadRepository, mockCommentRepository);

    const addedComment = await addCommentUseCase.execute(useCasePayload);
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.isThreadAvailable).toBeCalledWith('thread-1');
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        userId: useCasePayload.userId,
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
      })
    );
  });
});
