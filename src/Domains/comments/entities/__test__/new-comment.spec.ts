import { newCommentErrors } from '../constant/new-comment-errors';
import { NewComment, NewCommentPayload } from '../new-comment';

describe('NewComment entities', () => {
  it('should throw error when not contain required property', () => {
    const payload: unknown = {
      threadId: 'thread-1',
      userId: 'user-1',
    };

    expect(() => new NewComment(payload as NewCommentPayload)).toThrowError(
      newCommentErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw error when data type is wrong', () => {
    const payload: unknown = {
      threadId: [],
      userId: '1',
      content: 'f',
    };

    expect(() => new NewComment(payload as NewCommentPayload)).toThrowError(
      newCommentErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create NewComment entities correctly', () => {
    const payload = {
      threadId: 'thread-1',
      userId: 'user-1',
      content: 'f',
    };

    const newComment = new NewComment(payload);

    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.userId).toEqual(payload.userId);
    expect(newComment.content).toEqual(payload.content);
  });
});
