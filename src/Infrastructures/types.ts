const TYPES = {
  Pool: Symbol.for('pool'),
  IdGenerator: Symbol.for('idGenerator'),
  Bcrypt: Symbol.for('bcrypt'),
  HapiJwt: Symbol.for('hapiJwt'),
  Salt: Symbol.for('salt'),

  PasswordHash: Symbol.for('PasswordHash'),
  AuthenticationTokenManger: Symbol.for('AuthenticationTokenManager'),

  UserRepository: Symbol.for('UserRepository'),
  AuthenticationRepository: Symbol.for('AuthenticationRepository'),
  ThreadRepository: Symbol.for('ThreadRepository'),
  CommentRepository: Symbol.for('CommentRepository'),

  AddUserUseCase: Symbol.for('AddUserUseCase'),
  LoginUseCase: Symbol.for('LoginUserUseCase'),
  LogoutUseCase: Symbol.for('LogoutUserUseCase'),
  RefreshAuthenticationUseCase: Symbol.for('RefreshAuthenticationUseCase'),
  AddThreadUseCase: Symbol.for('AddThreadUseCase'),
  ThreadDetailUseCase: Symbol.for('ThreadDetailUseCase'),
  AddCommentUseCase: Symbol.for('AddCommentUseCase'),
  DeleteCommentUseCase: Symbol.for('DeleteCommentUseCase'),
  AddReplyUseCase: Symbol.for('AddReplyUseCase'),
  DeleteReplyUseCase: Symbol.for('DeleteReplyUseCase'),
};

export default TYPES;
