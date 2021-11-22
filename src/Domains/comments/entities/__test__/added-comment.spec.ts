import { AddedComment } from '../added-comment';
import { addedCommentErrors } from '../constant/added-comment-errors';

describe('AddedComment entities', () => {
  it('should throw error when payload not contain required entity', () => {
    const payload: unknown = {
      id: '1',
      content: 'content',
    };

    expect(() => new AddedComment(payload as AddedComment)).toThrowError(
      addedCommentErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw error when data type is wrong', () => {
    const payload: unknown = {
      id: 1,
      content: 'wer',
      owner: 'user-1',
    };

    expect(() => new AddedComment(payload as AddedComment)).toThrowError(
      addedCommentErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create AddedComment entities correctly', () => {
    const payload = {
      id: 'comment-1',
      content: 'erwer',
      owner: 'user-1',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
