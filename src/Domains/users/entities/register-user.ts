import { registerUserErrors } from './constant/register-user-errors';

export interface RegisterUserPayload {
  username: string;
  password: string;
  fullname: string;
}

export class RegisterUser {
  readonly username: string;

  readonly fullname: string;

  password: string;

  constructor(payload: RegisterUserPayload) {
    const { username, password, fullname } = payload;

    this.verifyPayload(payload);

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  verifyPayload(payload: RegisterUserPayload) {
    const { username, fullname, password } = payload;

    if (!username || !password || !fullname) {
      throw new Error(registerUserErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error(registerUserErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }

    if (username.length > 50) {
      throw new Error(registerUserErrors.USERNAME_LIMIT_CHAR);
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error(registerUserErrors.USERNAME_CONTAIN_RESTRICTED_CHARACTER);
    }
  }
}
