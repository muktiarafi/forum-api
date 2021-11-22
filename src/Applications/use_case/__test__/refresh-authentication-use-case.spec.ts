import { AuthenticationRepository } from '../../../Domains/authentications/authentication-repository';
import { AuthenticationTokenManager } from '../../security/authentication-token-manager';
import { RefreshAuthenticationUseCase, RefreshAuthenticationUseCasePayload } from '../refresh-authentication-use-case';

describe('RefreshAuthenticationUseCase', () => {
  const fakeAuthenticationRepository = <AuthenticationRepository>{};

  const fakeAuthenticationTokenManager = <AuthenticationTokenManager>{};
  it('should throw error if use case payload not contain token', async () => {
    const useCasePayload: unknown = {};
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      fakeAuthenticationRepository,
      fakeAuthenticationTokenManager
    );

    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload as RefreshAuthenticationUseCasePayload)
    ).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if use case payload does not meet data type specification', async () => {
    const useCasePayload: unknown = {
      refreshToken: 1,
    };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      fakeAuthenticationRepository,
      fakeAuthenticationTokenManager
    );

    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload as RefreshAuthenticationUseCasePayload)
    ).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating refresh authentication action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = <AuthenticationRepository>{};
    const mockAuthenticationTokenManager = <AuthenticationTokenManager>{};

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn(() =>
      Promise.resolve({ id: 'user-1', username: 'bambank' })
    );
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve('newAccessToken'));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository,
      mockAuthenticationTokenManager
    );

    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      id: 'user-1',
      username: 'bambank',
    });
    expect(accessToken).toEqual('newAccessToken');
  });
});
