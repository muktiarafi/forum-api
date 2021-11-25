import { DatabaseError } from 'pg';

import { CommentsTableTestHelper } from '../../../../tests/comments-table-test-helper';
import { LikesTableHelper } from '../../../../tests/likes-table-helper';
import { ThreadsTableHelper } from '../../../../tests/threads-table-helper';
import { UsersTableTestHelper } from '../../../../tests/user-table-test-helper';
import { ForbiddenError } from '../../../Commons/exceptions/forbidden-error';
import { NotFoundError } from '../../../Commons/exceptions/not-found-error';
import { AddedComment } from '../../../Domains/comments/entities/added-comment';
import { NewComment } from '../../../Domains/comments/entities/new-comment';
import { NewReply } from '../../../Domains/comments/entities/new-reply';
import { pool } from '../../database/postgres/pool';
import { CommentRepositoryPostgres } from '../comment-repository-postgres';

describe('CommentRepositoryPostgres', () => {
  describe('addComment function', () => {
    it('should persist and return AddedComment entities', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      const newComment = new NewComment({
        userId: 'user-1',
        threadId: 'thread-1',
        content: 'halooo',
      });
      const fakeIdGenerator = () => '1';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(newComment);
      const comments = await CommentsTableTestHelper.findComment('comment-1');

      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-1',
          content: 'halooo',
          owner: 'user-1',
        })
      );
    });
  });

  describe('addReply function', () => {
    it('shoul persist reply and return AddedComment entities', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const newReply = new NewReply({
        userId: 'user-1',
        parentId: 'thread-1',
        threadId: 'thread-1',
        content: 'ini reply',
      });
      const fakeIdGenerator = () => '99';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await commentRepositoryPostgres.addReply(newReply);
      const replies = await CommentsTableTestHelper.findComment('reply-99');

      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(
        new AddedComment({
          id: 'reply-99',
          content: 'ini reply',
          owner: 'user-1',
        })
      );
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return all CommentDetail array by thread id', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'reply-1',
        parentId: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');

      expect(comments).toHaveLength(1);

      const comment = comments[0];
      expect(comment.replies).toHaveLength(1);
      expect(comment.id).toEqual('comment-1');
      expect(comment.content).toEqual('ini komen');
      expect(comment.date).toBeDefined();
      expect(comment.username).toEqual('bambank');

      const reply = comment.replies[0];
      expect(reply.id).toEqual('reply-1');
      expect(reply.date).toBeDefined();
      expect(reply.username).toEqual('bambank');
      expect(reply.content).toEqual('ini reply');
    });

    it('should return empty comments if no comment found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');
      expect(comments).toHaveLength(0);
    });

    it('should return empty replies if no replies found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        password: 'secret',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');
      expect(comments).toHaveLength(1);

      const comment = comments[0];
      expect(comment.replies).toHaveLength(0);
      expect(comment.id).toEqual('comment-1');
      expect(comment.content).toEqual('ini komen');
      expect(comment.username).toEqual('bambank');
    });

    it('should return all CommentDetail with correct like count', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await LikesTableHelper.addLike('user-1', 'comment-1');
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');

      expect(comments).toHaveLength(1);

      const comment = comments[0];
      expect(comment.replies).toHaveLength(0);
      expect(comment.id).toEqual('comment-1');
      expect(comment.content).toEqual('ini komen');
      expect(comment.date).toBeDefined();
      expect(comment.username).toEqual('bambank');
      expect(comment.likeCount).toEqual(1);
    });
  });

  describe('checkOwnership function', () => {
    it('should throw error if comment or reply not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      await expect(commentRepositoryPostgres.checkOwnership('user-1', 'comment-99')).rejects.toThrow(NotFoundError);
    });

    it('should throw error if user is not owning the resource (comment)', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      await expect(commentRepositoryPostgres.checkOwnership('user-99', 'comment-1')).rejects.toThrow(ForbiddenError);
    });

    it('should throw error if user is not owning the resource (reply)', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addReply({
        id: 'comment-2',
        parentId: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      await expect(commentRepositoryPostgres.checkOwnership('user-99', 'comment-2')).rejects.toThrow(ForbiddenError);
    });

    it('should not throw error if comment is found and own the resource', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        password: 'secret',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      await expect(commentRepositoryPostgres.checkOwnership('user-1', 'comment-1')).resolves.not.toThrow(
        ForbiddenError
      );
    });
  });

  describe('deleteCommentOrReply function', () => {
    it('should set is_disable to true for comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');
      await commentRepositoryPostgres.deleteComment('comment-1');
      const comments = await CommentsTableTestHelper.findComment('comment-1');

      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('isCommentAvailable function', () => {
    it('should not throw error if comment is exist', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        password: 'secret',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      await expect(commentRepositoryPostgres.isCommentAvailable('comment-1')).resolves.not.toThrow(NotFoundError);
    });

    it('should throw error if comment is not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '1');

      await expect(commentRepositoryPostgres.isCommentAvailable('comment-1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateLike function', () => {
    it('should like the comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      await commentRepositoryPostgres.addLike('user-1', 'comment-1');

      const likesCount = await LikesTableHelper.findLike('user-1', 'comment-1');

      expect(likesCount).toHaveLength(1);
      expect(likesCount[0].count).toEqual('1');
    });

    it('should throw error when like the comment twice', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      await commentRepositoryPostgres.addLike('user-1', 'comment-1');

      await expect(commentRepositoryPostgres.addLike('user-1', 'comment-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await LikesTableHelper.addLike('user-1', 'comment-1');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      await commentRepositoryPostgres.deleteLike('user-1', 'comment-1');

      const likesCount = await LikesTableHelper.findLike('user-1', 'comment-1');

      expect(likesCount).toHaveLength(1);
      expect(likesCount[0].count).toEqual('0');
    });
  });

  describe('isLiked function', () => {
    it('should return true if comment is liked', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });
      await LikesTableHelper.addLike('user-1', 'comment-1');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      const isLiked = await commentRepositoryPostgres.isLiked('user-1', 'comment-1');

      expect(isLiked).toEqual(true);
    });

    it('should return false if comment is not liked', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-1',
      });
      await ThreadsTableHelper.addThread({
        id: 'thread-1',
        userId: 'user-1',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-1',
        userId: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      const isLiked = await commentRepositoryPostgres.isLiked('user-1', 'comment-1');

      expect(isLiked).toEqual(false);
    });
  });
});
