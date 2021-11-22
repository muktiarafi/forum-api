import { ThreadDetail, ThreadDetailPayload } from '../thread-detail';
import { threadDetailErrors } from '../constant/thread-detail-errors';

describe('a ThreadDetail entites', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload: unknown = {
      id: 'thread-1',
      title: 'title',
      body: 'hai',
      date: new Date(),
      username: 'bambank',
    };

    expect(() => new ThreadDetail(payload as ThreadDetailPayload)).toThrowError(
      threadDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY
    );
  });

  it('should throw error when paylod not meet data type specification', () => {
    const payload: unknown = {
      id: 'thread-1',
      title: 'title',
      body: 'hai',
      date: new Date(),
      username: 'bambank',
      comments: 1,
    };

    expect(() => new ThreadDetail(payload as ThreadDetailPayload)).toThrowError(
      threadDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION
    );
  });

  it('should create ThreadDetail entities', () => {
    const payload = {
      id: 'thread-1',
      title: 'title',
      body: 'hai',
      date: new Date(),
      username: 'bambank',
      comments: [],
    };

    const threadDetail = new ThreadDetail(payload);
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual(payload.comments);
  });
});
