import { AuthenticationsTableTestHelper } from '../../../../tests/authentication-table-test-helper';
import { AuthenticationTokenManager } from '../../../Applications/security/authentication-token-manager';
import container from '../../inversify.config';
import TYPES from '../../types';
import { createServer } from '../create-server';

describe('authentications handler', () => {
  describe('POST /authentications', () => {
    it('should response with 201 and new authentication', async () => {
      const requestPayload = {
        username: 'bambank',
        password: 'secret',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestPayload.username,
          password: requestPayload.password,
          fullname: 'buambank',
        },
      });

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });
    it('should response 400 if username not found', async () => {
      const requestPayload = {
        username: 'bambank',
        password: 'secret',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('User not found');
    });

    it('should response 401 if password wrong', async () => {
      const requestPayload = {
        username: 'bambank',
        password: '1234',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'bambank',
          password: 'secret',
          fullname: 'buambank',
        },
      });

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Bad credential');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'bambank',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('credential must contain username and password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username and password must be string');
    });
  });

  describe('PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'bambank',
          password: 'secret',
          fullname: 'buambank',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'bambank',
          password: 'secret',
        },
      });
      const {
        data: { refreshToken },
      } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refreshToken is required');
    });

    it('should return 400 if refresh token not string', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: [123],
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refreshToken must be a string');
    });

    it('should return 400 if refresh token not valid', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'abcdefg',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const server = await createServer(container);
      const refreshToken = await container
        .get<AuthenticationTokenManager>(TYPES.AuthenticationTokenManger)
        .createRefreshToken({
          id: 'user-1',
          username: 'dicoding',
        });

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const server = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const server = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refreshToken is required');
    });

    it('should response 400 if refresh token not string', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refreshToken must be a string');
    });
  });
});
