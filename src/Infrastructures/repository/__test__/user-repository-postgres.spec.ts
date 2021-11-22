import { UsersTableTestHelper } from '../../../../tests/user-table-test-helper';
import { InvariantError } from '../../../Commons/exceptions/invariant-error';
import { RegisterUser } from '../../../Domains/users/entities/register-user';
import { RegisteredUser } from '../../../Domains/users/entities/registered-user';
import { pool } from '../../database/postgres/pool';
import { UserRepositoryPostgres } from '../user-repository-postgres';

describe('UserRepositoryPostgres', () => {
  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        username: 'bambank',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '1');

      await expect(userRepositoryPostgres.verifyAvailableUsername('bambank')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '1');

      await expect(userRepositoryPostgres.verifyAvailableUsername('bambank')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'bambank',
        password: '12345678',
        fullname: 'buambank',
      });

      const fakeIdGenerator = () => '1';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUsersById('user-1');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'bambank',
        password: 'secret',
        fullname: 'buambank',
      });
      const fakeIdGenerator = () => '1';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-1',
          username: 'bambank',
          fullname: 'buambank',
        })
      );
    });
  });

  describe('getUser function', () => {
    it('should return registered user by username', async () => {
      const user = {
        id: 'user-1',
        username: 'bambank',
        password: 'secret',
        fullname: 'buambank',
      };
      await UsersTableTestHelper.addUser(user);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '1');

      const actualUser = await userRepositoryPostgres.getUserByUsername(user.username);

      expect(actualUser).toStrictEqual(
        new RegisteredUser({
          id: user.id,
          username: user.username,
          fullname: user.fullname,
        })
      );
    });

    it('should throw InvariantError if user is not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '1');

      await expect(userRepositoryPostgres.getUserByUsername('404')).rejects.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should return the password if user is found', async () => {
      const user = {
        id: 'user-1',
        username: 'bambank',
        password: 'secret',
        fullname: 'buambank',
      };
      await UsersTableTestHelper.addUser(user);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '1');

      const password = await userRepositoryPostgres.getPasswordByUsername(user.username);

      expect(password).toEqual(user.password);
    });

    it('should throw InvariantError when user is not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '1');

      await expect(userRepositoryPostgres.getPasswordByUsername('404')).rejects.toThrow(InvariantError);
    });
  });
});
