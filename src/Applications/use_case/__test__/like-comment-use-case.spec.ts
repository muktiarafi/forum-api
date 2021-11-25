import { CommentRepository } from '../../../Domains/comments/comment-repository';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { LikeCommentUseCase } from '../like-comment-use-case';

describe('LikeCommentUseCase', () => {
  it('should orchestrating like comment action correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };

    const mockThreadRepository = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepository.isThreadAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.isLiked = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.addLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase(mockThreadRepository, mockCommentRepository);

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.isThreadAvailable).toHaveBeenLastCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentAvailable).toHaveBeenLastCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.isLiked).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockCommentRepository.addLike).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });

  it('should orchestrating unlike comment action correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };

    const mockThreadRepository = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepository.isThreadAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.isLiked = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.deleteLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase(mockThreadRepository, mockCommentRepository);

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.isThreadAvailable).toHaveBeenLastCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentAvailable).toHaveBeenLastCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.isLiked).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockCommentRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});
