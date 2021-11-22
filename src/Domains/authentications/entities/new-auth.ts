import { newAuthErrors } from './constant/new-auth-errors';

export interface NewAuthPayload {
  accessToken: string;
  refreshToken: string;
}

export class NewAuth {
  readonly accessToken: string;

  readonly refreshToken: string;

  constructor(payload: NewAuthPayload) {
    this.verifyPayload(payload);

    const { accessToken, refreshToken } = payload;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  verifyPayload(payload: NewAuthPayload) {
    const { accessToken, refreshToken } = payload;

    if (!accessToken || !refreshToken) {
      throw new Error(newAuthErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error(newAuthErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
