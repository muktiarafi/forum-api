import { UserLogin, UserLoginPayload } from '../user-login';
import { userLoginErrors } from '../constant/user-login-errors';

describe('UserLogin etities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload: unknown = {
      username: 'bambank',
    };

    expect(() => new UserLogin(payload as UserLoginPayload)).toThrowError(userLoginErrors.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload: unknown = {
      username: 1234,
      password: [],
    };

    expect(() => new UserLogin(payload as UserLoginPayload)).toThrowError(
      userLoginErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create UserLogin etities', () => {
    const payload = {
      username: 'bambank',
      password: 'secret',
    };

    const userLogin = new UserLogin(payload);

    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
