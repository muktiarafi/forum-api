import { UsersTableTestHelper } from '../../../../tests/user-table-test-helper';
import container from '../../inversify.config';
import { createServer } from '../create-server';

describe('user handler', () => {
  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      const requestPayload = {
        username: 'bambank',
        password: 'secret',
        fullname: 'buambank',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        username: 'bambank',
      });
      const requestPayload = {
        username: 'bambank',
        fullname: 'buambank',
        password: 'hehe',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        username: 'bambank',
        password: 'secret',
        fullname: ['bumbanbank'],
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new user because of invalid data type');
    });

    it('should response 400 when username more than 50 character', async () => {
      const requestPayload = {
        username: 'abogobogaabogobogaabogobogaabogobogaabogobogaabogobogaabogobogaabogobogaabogobogaabogobogaabogoboga',
        password: 'secret',
        fullname: 'abogoboga',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot create new user because of the username cannot be more than 50 characters'
      );
    });

    it('should response 400 when username contain restricted character', async () => {
      const requestPayload = {
        username: 'satu dua',
        password: 'secret',
        fullname: 'satu dua',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
      );
    });

    it('should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        username: 'bambank',
      });
      const requestPayload = {
        username: 'bambank',
        fullname: 'buambank',
        password: 'secret',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });
  });
});
