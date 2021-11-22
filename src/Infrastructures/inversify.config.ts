import { Container } from 'inversify';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import Jwt from '@hapi/jwt';

import { PasswordHash } from '../Applications/security/password-hash';
import { pool } from './database/postgres/pool';
import { BcryptPasswordHash } from './security/bcrypt-password-hash';
import TYPES from './types';
import { AuthenticationTokenManager } from '../Applications/security/authentication-token-manager';
import { JwtTokenManager } from './security/jwt-token-manager';
import { UserRepository } from '../Domains/users/user-repository';
import { UserRepositoryPostgres } from './repository/user-repository-postgres';
import { AuthenticationRepository } from '../Domains/authentications/authentication-repository';
import { AuthenticationRepositoryPostgres } from './repository/authentication-repository-postgres';
import { ThreadRepository } from '../Domains/threads/thread-repository';
import { ThreadRepositoryPostgres } from './repository/thread-repository-postgres';
import { CommentRepository } from '../Domains/comments/comment-repository';
import { CommentRepositoryPostgres } from './repository/comment-repository-postgres';
import { AddUserUseCase } from '../Applications/use_case/add-user-use-case';
import { LoginUserUseCase } from '../Applications/use_case/login-user-use-case';
import { LogoutUserUseCase } from '../Applications/use_case/logout-use-case';
import { RefreshAuthenticationUseCase } from '../Applications/use_case/refresh-authentication-use-case';
import { AddThreadUseCase } from '../Applications/use_case/add-thread-use-case';
import { ThreadDetailUseCase } from '../Applications/use_case/thread-detail-use-case';
import { AddCommentUseCase } from '../Applications/use_case/add-comment-use-case';
import { DeleteCommentUseCase } from '../Applications/use_case/delete-comment-use-case';
import { AddReplyUseCase } from '../Applications/use_case/add-reply-use-case';
import { DeleteReplyUseCase } from '../Applications/use_case/delete-reply-use-case';

const container = new Container();
container.bind(TYPES.Pool).toConstantValue(pool);
container.bind<() => string>(TYPES.IdGenerator).toConstantValue(nanoid);
container.bind(TYPES.HapiJwt).toConstantValue(Jwt.token);
container.bind(TYPES.Bcrypt).toConstantValue(bcrypt);
container.bind(TYPES.Salt).toConstantValue(12);

container.bind<AuthenticationTokenManager>(TYPES.AuthenticationTokenManger).to(JwtTokenManager);
container.bind<PasswordHash>(TYPES.PasswordHash).to(BcryptPasswordHash);

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryPostgres);
container.bind<AuthenticationRepository>(TYPES.AuthenticationRepository).to(AuthenticationRepositoryPostgres);
container.bind<ThreadRepository>(TYPES.ThreadRepository).to(ThreadRepositoryPostgres);
container.bind<CommentRepository>(TYPES.CommentRepository).to(CommentRepositoryPostgres);

container.bind(TYPES.AddUserUseCase).to(AddUserUseCase);
container.bind(TYPES.LoginUseCase).to(LoginUserUseCase);
container.bind(TYPES.LogoutUseCase).to(LogoutUserUseCase);
container.bind(TYPES.RefreshAuthenticationUseCase).to(RefreshAuthenticationUseCase);
container.bind(TYPES.AddThreadUseCase).to(AddThreadUseCase);
container.bind(TYPES.ThreadDetailUseCase).to(ThreadDetailUseCase);
container.bind(TYPES.AddCommentUseCase).to(AddCommentUseCase);
container.bind(TYPES.DeleteCommentUseCase).to(DeleteCommentUseCase);
container.bind(TYPES.AddReplyUseCase).to(AddReplyUseCase);
container.bind(TYPES.DeleteReplyUseCase).to(DeleteReplyUseCase);

export default container;
