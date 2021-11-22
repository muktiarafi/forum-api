import { RegisterUser, RegisterUserPayload } from '../register-user';
import { registerUserErrors } from '../constant/register-user-errors';

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload: unknown = {
      username: 'abc',
      password: 'abc',
    };

    expect(() => new RegisterUser(payload as RegisterUserPayload)).toThrowError(
      registerUserErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload: unknown = {
      username: 123,
      fullname: true,
      password: 'abc',
    };

    expect(() => new RegisterUser(payload as RegisterUserPayload)).toThrowError(
      registerUserErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should throw error when username contains more than 50 character', () => {
    const payload = {
      username: 'abogobogagagagagagagagagagagagagagagagagagagagagagagagagagagagagagagagag',
      fullname: 'abogoboga',
      password: 'abc',
    };

    expect(() => new RegisterUser(payload)).toThrowError(registerUserErrors.USERNAME_LIMIT_CHAR);
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'abo go boga',
      fullname: 'abogoboga',
      password: '123',
    };

    expect(() => new RegisterUser(payload)).toThrowError(registerUserErrors.USERNAME_CONTAIN_RESTRICTED_CHARACTER);
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'abogoboga',
      fullname: 'abogoboga',
      password: 'abc',
    };

    const { username, fullname, password } = new RegisterUser(payload);

    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
