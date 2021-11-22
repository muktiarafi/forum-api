/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { AuthenticationTokenManager } from '../../Applications/security/authentication-token-manager';
import { Payload } from '../../Applications/security/types/payload';
import { InvariantError } from '../../Commons/exceptions/invariant-error';
import TYPES from '../types';

export interface IHapiJwt {
  generate(payload: Payload, key: string): string;
  decode(token: string): any;
  verify(artifacts: any, key: string): void;
}

@injectable()
export class JwtTokenManager implements AuthenticationTokenManager {
  readonly jwt: IHapiJwt;

  readonly accessTokenKey: string;

  readonly refreshTokenKey: string;

  constructor(@inject(TYPES.HapiJwt) jwt: IHapiJwt) {
    this.jwt = jwt;
    this.accessTokenKey = process.env.ACCESS_TOKEN_KEY!;
    this.refreshTokenKey = process.env.REFRESH_TOKEN_KEY!;
  }

  async createAccessToken(payload: Payload) {
    return this.jwt.generate(payload, this.accessTokenKey);
  }

  async createRefreshToken(payload: Payload) {
    return this.jwt.generate(payload, this.refreshTokenKey);
  }

  async verifyRefreshToken(token: string) {
    try {
      const artifacts = this.jwt.decode(token);
      this.jwt.verify(artifacts, this.refreshTokenKey);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string) {
    const artifcats = this.jwt.decode(token);

    return artifcats.decoded.payload;
  }
}
