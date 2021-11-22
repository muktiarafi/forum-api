import { CommentRepository } from '../../../Domains/comments/comment-repository';
import { AddedComment } from '../../../Domains/comments/entities/added-comment';
import { NewReply } from '../../../Domains/comments/entities/new-reply';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { AddReplyUseCase } from '../add-reply-use-case';

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      threadId: 'thread-1',
      parentId: 'comment-1',
      content: '1',
    };
    const expectedAddedReply = new AddedComment({
      id: 'comment-2',
      content: '1',
      owner: 'user-1',
    });

    const mockThreadRepository = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepository.isThreadAvailable = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkExistance = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply));

    const addReplyUseCase = new AddReplyUseCase(mockThreadRepository, mockCommentRepository);

    const addedReply = await addReplyUseCase.execute(useCasePayload);
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.isThreadAvailable).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkExistance).toHaveBeenCalledWith(useCasePayload.parentId);
    expect(mockCommentRepository.addReply).toHaveBeenCalledWith(
      new NewReply({
        userId: useCasePayload.userId,
        threadId: useCasePayload.threadId,
        parentId: useCasePayload.parentId,
        content: useCasePayload.content,
      })
    );
  });
});
