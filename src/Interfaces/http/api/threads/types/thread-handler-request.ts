import { IRequest } from '../../types/request';

export interface IPostThreadRequest extends IRequest {
  payload: {
    title: string;
    body: string;
  };
}

export interface IPostThreadCommentRequest extends IRequest {
  params: {
    threadId: string;
  };
  payload: {
    content: string;
  };
}

export interface IDeleteThreadCommentRequest extends IRequest {
  params: {
    threadId: string;
    commentId: string;
  };
}

export interface IGetThreadRequest extends IRequest {
  params: {
    threadId: string;
  };
}

export interface IPostCommentReplyRequest extends IRequest {
  params: {
    threadId: string;
    commentId: string;
  };
  payload: {
    content: string;
  };
}

export interface IDeleteCommentReplyRequest extends IRequest {
  params: {
    threadId: string;
    commentId: string;
    replyId: string;
  };
}
