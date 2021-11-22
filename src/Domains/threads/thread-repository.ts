import { AddedThread } from './entities/added-thread';
import { NewThread } from './entities/new-thread';
import { ThreadDetail } from './entities/thread-detail';

export interface ThreadRepository {
  addThread(newThread: NewThread): Promise<AddedThread>;
  getThread(threadId: string): Promise<ThreadDetail>;
  isThreadAvailable(threadId: string): Promise<void>;
}
