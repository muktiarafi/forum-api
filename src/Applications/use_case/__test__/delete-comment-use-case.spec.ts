import { CommentRepository } from '../../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { DeleteCommentUseCase } from '../delete-comment-use-case';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      commentId: 'thread-1',
      threadId: 'thread-1',
    };
    const mockThreadRepostitory = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepostitory.getThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkOwnership = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase(mockThreadRepostitory, mockCommentRepository);

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepostitory.getThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkOwnership).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});
