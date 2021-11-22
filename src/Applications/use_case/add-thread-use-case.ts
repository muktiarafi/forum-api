import { inject, injectable } from 'inversify';
import { NewThread } from '../../Domains/threads/entities/new-thread';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../../Infrastructures/types';

export interface AddThreadUseCasePayload {
  userId: string;
  title: string;
  body: string;
}

@injectable()
export class AddThreadUseCase {
  constructor(@inject(TYPES.ThreadRepository) public threadRepository: ThreadRepository) {}

  async execute(useCasePayload: AddThreadUseCasePayload) {
    const newThread = new NewThread(useCasePayload);

    return this.threadRepository.addThread(newThread);
  }
}
