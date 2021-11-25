import { AuthenticationHelper } from '../../../../tests/authentication-helper';
import { CommentsTableTestHelper } from '../../../../tests/comments-table-test-helper';
import { LikesTableHelper } from '../../../../tests/likes-table-helper';
import { ThreadsTableHelper } from '../../../../tests/threads-table-helper';
import { UsersTableTestHelper } from '../../../../tests/user-table-test-helper';
import { ThreadDetail } from '../../../Domains/threads/entities/thread-detail';
import container from '../../inversify.config';
import { createServer } from '../create-server';

describe('threads handler', () => {
  describe('POST /threads', () => {
    it('should respond with 201 and respond with added comment', async () => {
      const requestPayload = {
        title: 'title',
        body: 'body',
      };
      const server = await createServer(container);
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.owner).toEqual('user-1');
    });

    it('should respond with 400 and if payload not contain needed property', async () => {
      const requestPayload = {
        title: 'title',
      };
      const server = await createServer(container);
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new thread because of missing property');
    });

    it('should respond with 400 and if payload data type invalid', async () => {
      const requestPayload = {
        title: 'title',
        body: [],
      };
      const server = await createServer(container);
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new thread because of invalid data type');
    });
  });

  describe('POST /threads/{threadId}/comments', () => {
    it('should respond 201 status code and added comment', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedComment.owner).toEqual('user-1');
    });

    it('should respond 400 status code becaus of missing property', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(response.statusCode).toEqual(400);
      expect(responseJson.message).toEqual('cannot create new comment because of missing property');
    });

    it('should respond 400 status code becaus of invalid data type', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments',
        payload: {
          content: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(response.statusCode).toEqual(400);
      expect(responseJson.message).toEqual('cannot create new comment because of invalid data type');
    });

    it('should respond 404 status code if thread is not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-9999999999/comments',
        payload: {
          content: 'c',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Thread not found');
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond with 200 status code', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(response.statusCode).toEqual(200);
    });

    it('should respond with 404 if thread not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-9999999999/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Thread not found');
    });

    it('should respond with 404 if comment not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Resource not found');
    });

    it('should respond with 403 if commnet is not owned one', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-2',
        fullname: 'paijo',
        password: 'secret',
        username: 'paijo',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(response.statusCode).toEqual(403);
      expect(responseJson.message).toEqual('forbidden');
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should respond with 200 and thread detail', async () => {
      await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-2',
        fullname: 'paijo',
        password: 'secret',
        username: 'paijo',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual('thread-1');
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('bambank');
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
    });

    it('should respond with 404 if thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-999999',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 200 and thread detail with comments that sorted ASC', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-2',
        fullname: 'paijo',
        password: 'secret',
        username: 'paijo',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-3',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual('thread-1');
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('paijo');
      expect(responseJson.data.thread.comments).toHaveLength(3);

      const { comments } = responseJson.data.thread;
      let isSorted = true;
      for (let i = 1; i < comments.length; i += 1) {
        const olderComment = new Date(comments[i - 1].date);
        const newerComment = new Date(comments[i].date);

        if (olderComment.getTime() > newerComment.getTime()) {
          isSorted = false;
          break;
        }
      }
      expect(isSorted).toEqual(true);
    });

    it('should respond 200 and thread detail with replies that sorted ASC', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-2',
        fullname: 'paijo',
        password: 'secret',
        username: 'paijo',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        content: 'ini balasan 1',
        parentId: 'comment-2',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-2',
        content: 'ini balasan 2',
        parentId: 'comment-2',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-3',
        content: 'c',
        parentId: 'comment-2',
        threadId: 'thread-1',
        userId: 'user-2',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual('thread-1');
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('paijo');
      expect(responseJson.data.thread.comments).toHaveLength(2);

      const { replies } = responseJson.data.thread.comments[1];
      expect(replies).toHaveLength(3);

      let isSorted = true;
      for (let i = 1; i < replies.length; i += 1) {
        const olderComment = new Date(replies[i - 1].date);
        const newerComment = new Date(replies[i].date);

        if (olderComment.getTime() > newerComment.getTime()) {
          isSorted = false;
          break;
        }
      }
      expect(isSorted).toEqual(true);
    });

    it('should respond 200 and thread detail with comment that have been deleted', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'komentar ini nanti akan saya hapus',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const server = await createServer(container);

      await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-1',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual('thread-1');
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('bambank');
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toEqual('comment-1');
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });

    it('should respond 200 and thread detail with replies that have been deleted', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        content: 'balasan ini akan dihapus',
        threadId: 'thread-1',
        userId: 'user-1',
        parentId: 'comment-1',
      });

      const server = await createServer(container);

      await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-1/replies/reply-1',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual('thread-1');
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('bambank');
      expect(responseJson.data.thread.comments).toHaveLength(1);

      const { replies } = responseJson.data.thread.comments[0];
      expect(replies).toHaveLength(1);
      expect(replies[0].content).toEqual('**balasan telah dihapus**');
    });
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should respond 200 and added reply', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'haloo',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments/comment-1/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');

      const { addedReply } = responseJson.data;
      expect(addedReply.content).toEqual(requestPayload.content);
      expect(addedReply.owner).toEqual('user-1');
    });

    it('should respond 404 if thread not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'haloo',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-99999/comments/comment-1/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 404 if comment not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'haloo',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments/comment-999999/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 400 if payload missing required property', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments/comment-1/replies',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 400 if payload have wrong data type', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments/comment-1/replies',
        payload: {
          content: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should respond 200', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-1/replies/reply-1',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond 404 if thread not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-99999/comments/comment-1/replies/reply-1',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 404 if comment not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-9999/replies/reply-1',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 404 if reply not found', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-1/replies/reply-99999',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should respond 403 if reply is not owned one', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
        username: 'bambank',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-2',
        fullname: 'paijo',
        password: 'abcd',
        username: 'paijo',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        content: 'c',
        threadId: 'thread-1',
        userId: 'user-2',
      });
      const requestPayload = {
        content: 'content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-1/replies/reply-1',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should respond 200 and like the comment', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const server = await createServer(container);

      const likeResponse = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1/comments/comment-1/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(likeResponse.statusCode).toEqual(200);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const thread: ThreadDetail = responseJson.data.thread;

      expect(thread.id).toEqual('thread-1');
      expect(thread.comments).toHaveLength(1);

      const comment = thread.comments[0];
      expect(comment.id).toEqual('comment-1');
      expect(comment.likeCount).toEqual(1);
    });

    it('should respond 200 and unlike the comment', async () => {
      const accessToken = await AuthenticationHelper.generateAccessToken({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        title: 'title',
        body: 'body',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'e',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await LikesTableHelper.addLike('user-1', 'comment-1');

      const server = await createServer(container);

      const likeResponse = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1/comments/comment-1/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(likeResponse.statusCode).toEqual(200);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const thread: ThreadDetail = responseJson.data.thread;

      expect(thread.id).toEqual('thread-1');
      expect(thread.comments).toHaveLength(1);

      const comment = thread.comments[0];
      expect(comment.id).toEqual('comment-1');
      expect(comment.likeCount).toEqual(0);
    });
  });
});
