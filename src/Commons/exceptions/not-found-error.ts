import { ClientError } from './client-error';

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);

    Object.setPrototypeOf(this, NotFoundError.prototype);

    this.name = 'NotFoundError';
  }
}
