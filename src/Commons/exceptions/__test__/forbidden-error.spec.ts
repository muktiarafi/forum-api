import { ForbiddenError } from '../forbidden-error';

describe('ForbiddenError', () => {
  it('should create error correctly', () => {
    const forbiddenError = new ForbiddenError('forbidden');

    expect(forbiddenError.message).toEqual('forbidden');
    expect(forbiddenError.statusCode).toEqual(403);
    expect(forbiddenError.name).toEqual('ForbiddenError');
  });
});
