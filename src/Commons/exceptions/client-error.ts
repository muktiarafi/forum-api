export abstract class ClientError extends Error {
  constructor(public message: string, public statusCode = 400) {
    super(message);

    Object.setPrototypeOf(this, ClientError.prototype);

    this.name = 'ClientError';
  }
}
