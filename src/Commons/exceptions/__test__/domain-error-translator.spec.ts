import { DomainErrorTranslator } from '../domain-error-translator';
import { InvariantError } from '../invariant-error';
import { registerUserErrors } from '../../../Domains/users/entities/constant/register-user-errors';
import { userLoginErrors } from '../../../Domains/users/entities/constant/user-login-errors';
import { refreshAuthUseCaseErrors } from '../../../Applications/use_case/constant/refresh-auth-use-case-errors';
import { logoutUseCaseErrors } from '../../../Applications/use_case/constant/logout-use-case-errors';
import { newThreadErrors } from '../../../Domains/threads/entities/constant/new-thread-errors';
import { newCommentErrors } from '../../../Domains/comments/entities/constant/new-comment-errors';
import { newReplyErrors } from '../../../Domains/comments/entities/constant/new-reply-errors';

describe('DomainErrorTranslator', () => {
  it('should translate register user error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error(registerUserErrors.NOT_CONTAIN_NEEDED_PROPERTY))).toStrictEqual(
      new InvariantError('cannot create new user because of missing property')
    );
    expect(
      DomainErrorTranslator.translate(new Error(registerUserErrors.NOT_MEET_DATA_TYPE_SPECIFICATION))
    ).toStrictEqual(new InvariantError('cannot create new user because of invalid data type'));
    expect(DomainErrorTranslator.translate(new Error(registerUserErrors.USERNAME_LIMIT_CHAR))).toStrictEqual(
      new InvariantError('cannot create new user because of the username cannot be more than 50 characters')
    );
    expect(
      DomainErrorTranslator.translate(new Error(registerUserErrors.USERNAME_CONTAIN_RESTRICTED_CHARACTER))
    ).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
  });

  it('should translate user login error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error(userLoginErrors.NOT_CONTAIN_NEEDED_PROPERTY))).toStrictEqual(
      new InvariantError('credential must contain username and password')
    );
    expect(DomainErrorTranslator.translate(new Error(userLoginErrors.NOT_MEET_DATA_TYPE_SPECIFICATION))).toStrictEqual(
      new InvariantError('username and password must be string')
    );
  });

  it('should translate refresh authentication use case error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error(refreshAuthUseCaseErrors.NOT_CONTAIN_REFRESH_TOKEN))
    ).toStrictEqual(new InvariantError('refreshToken is required'));
    expect(
      DomainErrorTranslator.translate(new Error(refreshAuthUseCaseErrors.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION))
    ).toStrictEqual(new InvariantError('refreshToken must be a string'));
  });

  it('should translate logout use case error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error(logoutUseCaseErrors.NOT_CONTAIN_REFRESH_TOKEN))).toStrictEqual(
      new InvariantError('refreshToken is required')
    );
    expect(
      DomainErrorTranslator.translate(new Error(refreshAuthUseCaseErrors.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION))
    ).toStrictEqual(new InvariantError('refreshToken must be a string'));
  });

  it('should translate new thread errors correcntly', () => {
    expect(DomainErrorTranslator.translate(new Error(newThreadErrors.NOT_CONTAIN_NEEDED_PROPERTY))).toStrictEqual(
      new InvariantError('cannot create new thread because of missing property')
    );
    expect(DomainErrorTranslator.translate(new Error(newThreadErrors.NOT_MEET_DATA_TYPE_SPECIFICATION))).toStrictEqual(
      new InvariantError('cannot create new thread because of invalid data type')
    );
  });

  it('should translate new comment errors correcntly', () => {
    expect(DomainErrorTranslator.translate(new Error(newCommentErrors.NOT_CONTAIN_NEEDED_PROPERTY))).toStrictEqual(
      new InvariantError('cannot create new comment because of missing property')
    );
    expect(DomainErrorTranslator.translate(new Error(newCommentErrors.NOT_MEET_DATA_TYPE_SPECIFICATION))).toStrictEqual(
      new InvariantError('cannot create new comment because of invalid data type')
    );
  });

  it('should translate new reply errors correcntly', () => {
    expect(DomainErrorTranslator.translate(new Error(newReplyErrors.NOT_CONTAIN_NEEDED_PROPERTY))).toStrictEqual(
      new InvariantError('cannot create new reply because of missing property')
    );
    expect(DomainErrorTranslator.translate(new Error(newReplyErrors.NOT_MEET_DATA_TYPE_SPECIFICATION))).toStrictEqual(
      new InvariantError('cannot create new reply because of invalid data type')
    );
  });

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('this is an error');

    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});
