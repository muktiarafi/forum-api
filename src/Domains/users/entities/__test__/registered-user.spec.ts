import { RegisteredUser, RegisteredUserPayload } from '../registered-user';
import { registeredUserErrors } from '../constant/registered-user-errors';

describe('a RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload: unknown = {
      username: 'abogoboga',
      fullname: 'abogobogagaga',
    };

    expect(() => new RegisteredUser(payload as RegisteredUserPayload)).toThrowError(
      registeredUserErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload: unknown = {
      id: 123,
      username: 'bambank',
      fullname: 'bambankkk',
    };

    expect(() => new RegisteredUser(payload as RegisteredUserPayload)).toThrowError(
      registeredUserErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create create registeredUser object correctly', () => {
    const payload = {
      id: 'user-1',
      username: 'bambank',
      fullname: 'buambank',
    };

    const registeredUser = new RegisteredUser(payload);

    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
