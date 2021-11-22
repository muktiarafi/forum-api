import { Payload } from './types/payload';

export interface AuthenticationTokenManager {
  createAccessToken(payload: Payload): Promise<string>;
  createRefreshToken(payload: Payload): Promise<string>;
  verifyRefreshToken(token: string): Promise<void>;
  decodePayload(token: string): Promise<Payload>;
}
