import { Container } from 'inversify';
import { createServer } from '../create-server';

describe('HTTP server', () => {
  describe('when POST /users', () => {
    it('should response 404 when request unregistered route', async () => {
      const fakeContainer: unknown = {};
      const server = await createServer(fakeContainer as Container);
      const response = await server.inject({
        method: 'GET',
        url: '/unregisteredRoute',
      });
      expect(response.statusCode).toEqual(200);
    });

    it('should handle server error correctly', async () => {
      const requestPayload = {
        username: 'werfewrwer',
        fullname: 'opkppkfiweprwer',
        password: '12345678',
      };
      const fakeContainer: unknown = {};

      const server = await createServer(fakeContainer as Container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toEqual('Internal server error');
    });
  });
});
