import { CommentRepository } from '../../../Domains/comments/comment-repository';
import { CommentDetail } from '../../../Domains/comments/entities/comment-detail';
import { ThreadDetail } from '../../../Domains/threads/entities/thread-detail';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { ThreadDetailUseCase } from '../thread-detail-use-case';

describe('ThreadDetailUseCase', () => {
  it('should orchestrating get thread detail action correctly', async () => {
    const expectedCommentDetails = [
      new CommentDetail({
        id: 'comment-1',
        content: '1',
        date: new Date().toString(),
        username: 'bambank',
        replies: [],
        likeCount: 0,
        isDelete: false,
      }),
    ];
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-1',
      title: 'title',
      body: 'body',
      date: new Date(),
      username: 'user-1',
      comments: expectedCommentDetails,
    });

    const mockThreadRepository = <ThreadRepository>{};
    const mockCommentRepository = <CommentRepository>{};

    mockThreadRepository.getThread = jest.fn(() => Promise.resolve(expectedThreadDetail));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(expectedCommentDetails));

    const threadDetailUseCase = new ThreadDetailUseCase(mockThreadRepository, mockCommentRepository);

    const threadDetail = await threadDetailUseCase.execute('thread-1');

    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThread).toBeCalledWith('thread-1');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-1');
  });
});
