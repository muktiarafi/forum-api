import { AuthenticationRepository } from '../../../Domains/authentications/authentication-repository';
import { NewAuth } from '../../../Domains/authentications/entities/new-auth';
import { RegisteredUser } from '../../../Domains/users/entities/registered-user';
import { UserRepository } from '../../../Domains/users/user-repository';
import { AuthenticationTokenManager } from '../../security/authentication-token-manager';
import { PasswordHash } from '../../security/password-hash';
import { LoginUserUseCase } from '../login-user-use-case';

describe('loginUseCase', () => {
  it('should orchestrating the get loginUseCase correctly', async () => {
    const useCasePayload = {
      username: 'bambank',
      password: 'text',
    };
    const expectedAuthentication = new NewAuth({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
    const mockAuthenticationRepository = <AuthenticationRepository>{};
    const mockAuthenticationTokenManager = <AuthenticationTokenManager>{};
    const mockUserRepository = <UserRepository>{};
    const mockPasswordHash = <PasswordHash>{};

    mockAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() =>
      Promise.resolve(expectedAuthentication.accessToken)
    );
    mockAuthenticationTokenManager.createRefreshToken = jest.fn(() =>
      Promise.resolve(expectedAuthentication.refreshToken)
    );
    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockUserRepository.getPasswordByUsername = jest.fn(() => Promise.resolve('hash'));
    mockUserRepository.getUserByUsername = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new RegisteredUser({
          id: 'user-1',
          username: 'bambank',
          fullname: 'buambank',
        })
      )
    );

    const loginUserUseCase = new LoginUserUseCase(
      mockUserRepository,
      mockAuthenticationRepository,
      mockAuthenticationTokenManager,
      mockPasswordHash
    );

    const authenticationResult = await loginUserUseCase.execute(useCasePayload);

    expect(authenticationResult).toEqual(expectedAuthentication);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockUserRepository.getUserByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.comparePassword).toBeCalledWith('text', 'hash');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      id: 'user-1',
      username: useCasePayload.username,
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      id: 'user-1',
      username: useCasePayload.username,
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(expectedAuthentication.refreshToken);
  });
});
