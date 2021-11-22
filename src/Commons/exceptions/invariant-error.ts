import { ClientError } from './client-error';

export class InvariantError extends ClientError {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvariantError.prototype);

    this.name = 'InvariantError';
  }
}
