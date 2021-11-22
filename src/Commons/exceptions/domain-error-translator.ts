import { InvariantError } from './invariant-error';
import { registerUserErrors } from '../../Domains/users/entities/constant/register-user-errors';
import { userLoginErrors } from '../../Domains/users/entities/constant/user-login-errors';
import { refreshAuthUseCaseErrors } from '../../Applications/use_case/constant/refresh-auth-use-case-errors';
import { logoutUseCaseErrors } from '../../Applications/use_case/constant/logout-use-case-errors';
import { newThreadErrors } from '../../Domains/threads/entities/constant/new-thread-errors';
import { newCommentErrors } from '../../Domains/comments/entities/constant/new-comment-errors';
import { newReplyErrors } from '../../Domains/comments/entities/constant/new-reply-errors';

export class DomainErrorTranslator {
  private static readonly directories = new Map([
    [
      registerUserErrors.NOT_CONTAIN_NEEDED_PROPERTY,
      new InvariantError('cannot create new user because of missing property'),
    ],
    [
      registerUserErrors.NOT_MEET_DATA_TYPE_SPECIFICATION,
      new InvariantError('cannot create new user because of invalid data type'),
    ],
    [
      registerUserErrors.USERNAME_LIMIT_CHAR,
      new InvariantError('cannot create new user because of the username cannot be more than 50 characters'),
    ],
    [
      registerUserErrors.USERNAME_CONTAIN_RESTRICTED_CHARACTER,
      new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    ],

    [userLoginErrors.NOT_CONTAIN_NEEDED_PROPERTY, new InvariantError('credential must contain username and password')],
    [userLoginErrors.NOT_MEET_DATA_TYPE_SPECIFICATION, new InvariantError('username and password must be string')],

    [refreshAuthUseCaseErrors.NOT_CONTAIN_REFRESH_TOKEN, new InvariantError('refreshToken is required')],
    [
      refreshAuthUseCaseErrors.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION,
      new InvariantError('refreshToken must be a string'),
    ],

    [logoutUseCaseErrors.NOT_CONTAIN_REFRESH_TOKEN, new InvariantError('refreshToken is required')],
    [logoutUseCaseErrors.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION, new InvariantError('refreshToken must be a string')],

    [
      newThreadErrors.NOT_CONTAIN_NEEDED_PROPERTY,
      new InvariantError('cannot create new thread because of missing property'),
    ],
    [
      newThreadErrors.NOT_MEET_DATA_TYPE_SPECIFICATION,
      new InvariantError('cannot create new thread because of invalid data type'),
    ],

    [
      newCommentErrors.NOT_CONTAIN_NEEDED_PROPERTY,
      new InvariantError('cannot create new comment because of missing property'),
    ],
    [
      newCommentErrors.NOT_MEET_DATA_TYPE_SPECIFICATION,
      new InvariantError('cannot create new comment because of invalid data type'),
    ],

    [
      newReplyErrors.NOT_CONTAIN_NEEDED_PROPERTY,
      new InvariantError('cannot create new reply because of missing property'),
    ],
    [
      newReplyErrors.NOT_MEET_DATA_TYPE_SPECIFICATION,
      new InvariantError('cannot create new reply because of invalid data type'),
    ],
  ]);

  static translate(error: Error) {
    return this.directories.get(error.message) || error;
  }
}
