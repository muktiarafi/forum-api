import { newReplyErrors } from '../constant/new-reply-errors';
import { NewReply, NewReplyPayload } from '../new-reply';

describe('NewReply entities', () => {
  it('should throw error when payload not contain required properties', () => {
    const payload: unknown = {
      userId: 'user-1',
      threadId: 'thread-1',
      parentId: 'comment-1',
    };

    expect(() => new NewReply(payload as NewReplyPayload)).toThrowError(newReplyErrors.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when paylod data type is wrong', () => {
    const payload: unknown = {
      userId: [],
      threadId: 1,
      parentId: 'comment-1',
      content: 'wer',
    };

    expect(() => new NewReply(payload as NewReplyPayload)).toThrowError(
      newReplyErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create NewReply entities correctly', () => {
    const payload = {
      userId: 'user-1',
      threadId: 'thread-1',
      parentId: 'comment-1',
      content: 'wer',
    };

    const newReply = new NewReply(payload);

    expect(newReply.userId).toEqual(payload.userId);
    expect(newReply.threadId).toEqual(payload.threadId);
    expect(newReply.parentId).toEqual(payload.parentId);
    expect(newReply.content).toEqual(payload.content);
  });
});
