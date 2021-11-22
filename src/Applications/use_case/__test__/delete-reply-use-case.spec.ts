import { CommentRepository } from '../../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { DeleteReplyUseCase } from '../delete-reply-use-case';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete use case correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-1',
      replyId: 'reply-1',
    };

    const mockThreadRepository = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkExistance = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkOwnership = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase(mockThreadRepository, mockCommentRepository);

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThread).toHaveBeenLastCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkExistance).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkOwnership).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.replyId);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
