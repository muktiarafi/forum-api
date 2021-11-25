import { AddedComment } from './entities/added-comment';
import { CommentDetail } from './entities/comment-detail';
import { NewComment } from './entities/new-comment';
import { NewReply } from './entities/new-reply';

export interface CommentRepository {
  addComment(newComment: NewComment): Promise<AddedComment>;
  addReply(newReply: NewReply): Promise<AddedComment>;
  getCommentsByThreadId(threadId: string): Promise<CommentDetail[]>;
  deleteComment(commentId: string): Promise<void>;
  checkOwnership(userId: string, commentId: string): Promise<void>;
  isCommentAvailable(commentId: string): Promise<void>;
  addLike(userId: string, commentId: string): Promise<void>;
  deleteLike(userId: string, commentId: string): Promise<void>;
  isLiked(userId: string, commentId: string): Promise<boolean>;
}
