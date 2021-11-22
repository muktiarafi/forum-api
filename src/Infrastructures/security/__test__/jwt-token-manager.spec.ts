import Jwt from '@hapi/jwt';
import { Payload } from '../../../Applications/security/types/payload';

import { InvariantError } from '../../../Commons/exceptions/invariant-error';
import { IHapiJwt, JwtTokenManager } from '../jwt-token-manager';

describe('JwtTokenManager', () => {
  describe('createAccessTken function', () => {
    it('should create accessTokenCorrectly', async () => {
      const payload = {
        id: '1',
        username: 'bambank',
      };
      const mockJwtToken: unknown = {
        generate: jest.fn().mockImplementation(() => 'token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken as IHapiJwt);
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect((mockJwtToken as IHapiJwt).generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(accessToken).toEqual('token');
    });
  });

  describe('refreshToken function', () => {
    it('should create refreshTokenCorrectly', async () => {
      const payload: unknown = {
        id: '1',
        username: 'bambank',
      };
      const mockJwtToken: unknown = {
        generate: jest.fn().mockImplementation(() => 'token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken as IHapiJwt);

      const refreshToken = await jwtTokenManager.createRefreshToken(payload as Payload);

      expect((mockJwtToken as IHapiJwt).generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken).toEqual('token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should not throw InvariantError when refresh token is valid', async () => {
      const payload: unknown = {
        id: '1',
        username: 'bambank',
      };
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken(payload as Payload);

      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError);
    });

    it('should throw InvariantError when refresh token is not valid', async () => {
      const payload = {
        id: '1',
        username: 'bambanl',
      };
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      const payload = {
        id: '1',
        username: 'bambank',
      };
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      expect(expectedUsername).toEqual(payload.username);
    });
  });
});
