import { ThreadsTableHelper } from '../../../../tests/threads-table-helper';
import { UsersTableTestHelper } from '../../../../tests/user-table-test-helper';
import { NotFoundError } from '../../../Commons/exceptions/not-found-error';
import { AddedThread } from '../../../Domains/threads/entities/added-thread';
import { NewThread } from '../../../Domains/threads/entities/new-thread';
import { ThreadDetail } from '../../../Domains/threads/entities/thread-detail';
import { pool } from '../../database/postgres/pool';
import { ThreadRepositoryPostgres } from '../thread-repository-postgres';

describe('ThreadRepositoryPostgres', () => {
  describe('addThread function', () => {
    it('should persist and return added thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'secret',
        fullname: 'bubambank',
        username: 'bambank',
      });
      const newThread = new NewThread({
        userId: 'user-123',
        title: 'title',
        body: 'body',
      });

      const idGenerator = () => '1';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      const threads = await ThreadsTableHelper.findThread('thread-1');

      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-1',
          title: 'title',
          owner: 'user-123',
        })
      );
    });
  });

  describe('getThread function', () => {
    it('should get persisted thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        password: 'secret',
        fullname: 'bubambank',
        username: 'bambank',
      });
      const thread = {
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-123',
      };

      await ThreadsTableHelper.addThread(thread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '1');

      const persistedThread = await threadRepositoryPostgres.getThread('thread-1');
      expect(persistedThread).toBeInstanceOf(ThreadDetail);
      expect(persistedThread.id).toEqual(thread.id);
      expect(persistedThread.title).toEqual(thread.title);
      expect(persistedThread.body).toEqual(thread.body);
      expect(persistedThread.username).toEqual('bambank');
      expect(persistedThread.date).toBeDefined();
      expect(persistedThread.comments).toHaveLength(0);
    });

    it('should throw not found error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '1');

      await expect(threadRepositoryPostgres.getThread('thread-99999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('isThreadAvailable function', () => {
    it('should not throw not found error if thread is found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '');

      await expect(threadRepositoryPostgres.isThreadAvailable('thread-1')).resolves.not.toThrow(NotFoundError);
    });

    it('should throw not found error if thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '');

      await expect(threadRepositoryPostgres.isThreadAvailable('thread-99')).rejects.toThrowError(NotFoundError);
    });
  });
});
