import { CommentDetail, CommentDetailPayload } from '../comment-detail';
import { commentDetailErrors } from '../constant/comment-detail-errors';

describe('CommentDetail entities', () => {
  it('should throw error when paylod not contain required property', () => {
    const payload: unknown = {
      id: 'comment-1',
      content: 'content',
      date: new Date().toString(),
      username: 'fwerwer',
      isDelete: false,
    };

    expect(() => new CommentDetail(payload as CommentDetailPayload)).toThrowError(
      commentDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw when data type is wrong', () => {
    const payload: unknown = {
      id: 'comment-1',
      content: 'content',
      date: new Date(),
      username: 'fwerwer',
      replies: true,
      isDelete: false,
    };

    expect(() => new CommentDetail(payload as CommentDetailPayload)).toThrowError(
      commentDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create CommentDetail entities', () => {
    const payload = {
      id: 'comment-1',
      content: 'content',
      date: new Date().toString(),
      username: 'fwerwer',
      replies: [],
      isDelete: false,
    };

    const commentDetail = new CommentDetail(payload);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.replies).toEqual(payload.replies);
  });

  it('should display that comment is deleted', () => {
    const payload = {
      id: 'comment-1',
      content: 'content',
      date: new Date().toString(),
      username: 'fwerwer',
      replies: [],
      isDelete: true,
    };

    const commentDetail = new CommentDetail(payload);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.replies).toEqual(payload.replies);
  });
});
