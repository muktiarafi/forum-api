import { ClientError } from './client-error';

export class ForbiddenError extends ClientError {
  constructor(message: string) {
    super(message, 403);

    Object.setPrototypeOf(this, ForbiddenError.prototype);

    this.name = 'ForbiddenError';
  }
}
