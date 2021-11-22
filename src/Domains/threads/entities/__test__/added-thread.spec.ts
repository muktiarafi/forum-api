import { AddedThread, AddedThreadPayload } from '../added-thread';
import { addedThreadErrors } from '../constant/added-thread-errors';

describe('an AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload: unknown = {
      id: 'thread-id',
      title: 'yoloo',
    };

    expect(() => new AddedThread(payload as AddedThreadPayload)).toThrowError(
      addedThreadErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload: unknown = {
      id: 'thread-id',
      title: 'yoloo',
      owner: [],
    };

    expect(() => new AddedThread(payload as AddedThreadPayload)).toThrowError(
      addedThreadErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create AddedThread entities', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'user-132',
    };

    const addedThread = new AddedThread(payload);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
