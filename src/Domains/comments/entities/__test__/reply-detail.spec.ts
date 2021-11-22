import { replyDetailErrors } from '../constant/reply-detail-errors';
import { ReplyDetail, ReplyDetailPayload } from '../reply-detail';

describe('ReplyDetail entities', () => {
  it('should throw error when paylod not contain required property', () => {
    const payload: unknown = {
      id: 'comment-1',
      content: 'content',
      date: new Date().toString(),
    };

    expect(() => new ReplyDetail(payload as ReplyDetailPayload)).toThrowError(
      replyDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw when data type is wrong', () => {
    const payload: unknown = {
      id: [],
      content: 'content',
      date: 1,
      username: 'fwerwer',
    };

    expect(() => new ReplyDetail(payload as ReplyDetailPayload)).toThrowError(
      replyDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create ReplyDetail entities', () => {
    const payload: ReplyDetailPayload = {
      id: 'comment-1',
      content: 'content',
      date: new Date().toString(),
      username: 'fwerwer',
      isDelete: false,
    };

    const replyDetail = new ReplyDetail(payload);
    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.content).toEqual(payload.content);
    expect(replyDetail.date).toEqual(payload.date);
    expect(replyDetail.username).toEqual(payload.username);
  });

  it('should display that reply is deleted', () => {
    const payload = {
      id: 'comment-1',
      content: 'content',
      date: new Date().toString(),
      username: 'fwerwer',
      isDelete: true,
    };

    const replyDetail = new ReplyDetail(payload);
    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.content).toEqual('**balasan telah dihapus**');
    expect(replyDetail.date).toEqual(payload.date);
    expect(replyDetail.username).toEqual(payload.username);
  });
});
