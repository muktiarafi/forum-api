import { AddedThread } from '../../../Domains/threads/entities/added-thread';
import { NewThread } from '../../../Domains/threads/entities/new-thread';
import { ThreadRepository } from '../../../Domains/threads/thread-repository';
import { AddThreadUseCase } from '../add-thread-use-case';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      userId: 'user-1',
      title: 'title',
      body: 'body',
    };
    const expectedAddedThread = new AddedThread({
      id: 'comment-1',
      title: 'title',
      owner: 'user-1',
    });

    const mockThreadRepository = <ThreadRepository>{};
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedAddedThread));

    const addThreadUseCase = new AddThreadUseCase(mockThreadRepository);

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        userId: useCasePayload.userId,
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
