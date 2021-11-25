import 'reflect-metadata';
import { pool } from '../src/Infrastructures/database/postgres/pool';
import { AuthenticationsTableTestHelper } from './authentication-table-test-helper';
import { CommentsTableTestHelper } from './comments-table-test-helper';
import { LikesTableHelper } from './likes-table-helper';
import { ThreadsTableHelper } from './threads-table-helper';
import { UsersTableTestHelper } from './user-table-test-helper';

afterAll(async () => {
  await pool.end();
});

afterEach(async () => {
  await LikesTableHelper.cleanTable();
  await CommentsTableTestHelper.cleanTable();
  await ThreadsTableHelper.cleanTable();
  await AuthenticationsTableTestHelper.cleanTable();
  await UsersTableTestHelper.cleanTable();
});
