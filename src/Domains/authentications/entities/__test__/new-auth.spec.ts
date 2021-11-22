import { NewAuth, NewAuthPayload } from '../new-auth';
import { newAuthErrors } from '../constant/new-auth-errors';

describe('a NewAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload: unknown = {
      accessToken: 'accessToken',
    };

    expect(() => new NewAuth(payload as NewAuthPayload)).toThrowError(newAuthErrors.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw erorr when payload not meet data type specification', () => {
    const payload: unknown = {
      accessToken: ['accessToken'],
      refreshToken: 12345,
    };

    expect(() => new NewAuth(payload as NewAuthPayload)).toThrowError(newAuthErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should create NewAuth entities correctly', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const newAuth = new NewAuth(payload);

    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
