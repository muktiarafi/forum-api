import { userLoginErrors } from './constant/user-login-errors';

export interface UserLoginPayload {
  username: string;
  password: string;
}

export class UserLogin {
  readonly username: string;

  readonly password: string;

  constructor(payload: UserLoginPayload) {
    this.verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  verifyPayload(payload: UserLoginPayload) {
    const { username, password } = payload;

    if (!username || !password) {
      throw new Error(userLoginErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error(userLoginErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
