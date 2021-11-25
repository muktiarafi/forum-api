import { ResponseToolkit } from '@hapi/hapi';
import { Container } from 'inversify';
import { AddCommentUseCase } from '../../../../Applications/use_case/add-comment-use-case';
import { AddReplyUseCase } from '../../../../Applications/use_case/add-reply-use-case';
import { AddThreadUseCase } from '../../../../Applications/use_case/add-thread-use-case';
import { DeleteCommentUseCase } from '../../../../Applications/use_case/delete-comment-use-case';
import { DeleteReplyUseCase } from '../../../../Applications/use_case/delete-reply-use-case';
import { LikeCommentUseCase } from '../../../../Applications/use_case/like-comment-use-case';
import { ThreadDetailUseCase } from '../../../../Applications/use_case/thread-detail-use-case';
import TYPES from '../../../../Infrastructures/types';
import {
  IDeleteCommentReplyRequest,
  IDeleteThreadCommentRequest,
  IGetThreadRequest,
  IPostCommentReplyRequest,
  IPostThreadCommentRequest,
  IPostThreadRequest,
  IPutCommentLikeRequest,
} from './types/thread-handler-request';

export class ThreadsHandler {
  constructor(public container: Container) {}

  postThreadHandler = async (request: IPostThreadRequest, h: ResponseToolkit) => {
    const addThreadUseCase = this.container.get<AddThreadUseCase>(TYPES.AddThreadUseCase);
    const { id: userId } = request.auth.credentials;
    const { title, body } = request.payload;

    const addedThread = await addThreadUseCase.execute({
      userId,
      title,
      body,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedThread,
        },
      })
      .code(201);
  };

  postThreadCommentHandler = async (request: IPostThreadCommentRequest, h: ResponseToolkit) => {
    const addCommentUseCase = this.container.get<AddCommentUseCase>(TYPES.AddCommentUseCase);
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;

    const addedComment = await addCommentUseCase.execute({
      userId,
      threadId,
      content,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedComment,
        },
      })
      .code(201);
  };

  deleteThreadCommentHandler = async (request: IDeleteThreadCommentRequest, h: ResponseToolkit) => {
    const deleteCommentUseCase = this.container.get<DeleteCommentUseCase>(TYPES.DeleteCommentUseCase);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute({
      userId,
      threadId,
      commentId,
    });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  };

  getThreadHandler = async (request: IGetThreadRequest, h: ResponseToolkit) => {
    const threadDetailUseCase = this.container.get<ThreadDetailUseCase>(TYPES.ThreadDetailUseCase);
    const { threadId } = request.params;

    const thread = await threadDetailUseCase.execute(threadId);

    return h
      .response({
        status: 'success',
        data: {
          thread,
        },
      })
      .code(200);
  };

  postCommentReplyHandler = async (request: IPostCommentReplyRequest, h: ResponseToolkit) => {
    const addReplyUseCase = this.container.get<AddReplyUseCase>(TYPES.AddReplyUseCase);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload;

    const addedReply = await addReplyUseCase.execute({
      userId,
      threadId,
      parentId: commentId,
      content,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedReply,
        },
      })
      .code(201);
  };

  deleteCommentReplyHandler = async (request: IDeleteCommentReplyRequest, h: ResponseToolkit) => {
    const deleteReplyUseCase = this.container.get<DeleteReplyUseCase>(TYPES.DeleteReplyUseCase);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    await deleteReplyUseCase.execute({
      userId,
      threadId,
      commentId,
      replyId,
    });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  };

  putCommentLikeHandler = async (request: IPutCommentLikeRequest, h: ResponseToolkit) => {
    const likeCommentUseCase = this.container.get<LikeCommentUseCase>(TYPES.LikeCommentUseCase);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await likeCommentUseCase.execute({
      userId,
      threadId,
      commentId,
    });

    return h.response({
      status: 'success',
    });
  };
}
