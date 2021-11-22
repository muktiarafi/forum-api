import { AuthenticationRepository } from '../../../Domains/authentications/authentication-repository';
import { LogoutUserUseCase, LogoutUserUseCasePayload } from '../logout-use-case';

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    const useCasePayload: unknown = {};
    const fakeAuthenticationRepository = <AuthenticationRepository>{};
    const logoutUserUseCase = new LogoutUserUseCase(fakeAuthenticationRepository);

    await expect(logoutUserUseCase.execute(useCasePayload as LogoutUserUseCasePayload)).rejects.toThrowError(
      'LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    );
  });

  it('should throw error if use case payload does not meet data type specification', async () => {
    const useCasePayload: unknown = {
      refreshToken: 1,
    };
    const fakeAuthenticationRepository = <AuthenticationRepository>{};
    const logoutUserUseCase = new LogoutUserUseCase(fakeAuthenticationRepository);

    await expect(logoutUserUseCase.execute(useCasePayload as LogoutUserUseCasePayload)).rejects.toThrowError(
      'LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the logout action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = <AuthenticationRepository>{};
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase(mockAuthenticationRepository);

    await logoutUserUseCase.execute(useCasePayload);

    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toBeCalledWith(useCasePayload.refreshToken);
  });
});
