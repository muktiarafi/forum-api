import { registeredUserErrors } from './constant/registered-user-errors';

export interface RegisteredUserPayload {
  id: string;
  username: string;
  fullname: string;
}

export class RegisteredUser {
  readonly id: string;

  readonly username: string;

  readonly fullname: string;

  constructor(payload: RegisteredUserPayload) {
    const { id, username, fullname } = payload;
    this.verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  verifyPayload({ id, username, fullname }: RegisteredUserPayload) {
    if (!id || !username || !fullname) {
      throw new Error(registeredUserErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error(registeredUserErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
