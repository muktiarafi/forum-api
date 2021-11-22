import { NewThread, NewThreadPayload } from '../new-thread';
import { newThreadErrors } from '../constant/new-thread-errors';

describe('an NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload: unknown = {
      userId: 'user-1',
      title: 'ini title',
    };

    expect(() => new NewThread(payload as NewThreadPayload)).toThrowError(newThreadErrors.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload: unknown = {
      userId: [1],
      title: 123,
      body: true,
    };

    expect(() => new NewThread(payload as NewThreadPayload)).toThrowError(
      newThreadErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create NewThread entities', () => {
    const payload = {
      userId: 'user-1',
      title: 'this is title',
      body: 'this is body',
    };

    const newThread = new NewThread(payload);
    expect(newThread.userId).toEqual(payload.userId);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
