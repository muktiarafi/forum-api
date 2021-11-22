import { inject, injectable } from 'inversify';
import { AuthenticationRepository } from '../../Domains/authentications/authentication-repository';
import TYPES from '../../Infrastructures/types';
import { AuthenticationTokenManager } from '../security/authentication-token-manager';
import { refreshAuthUseCaseErrors } from './constant/refresh-auth-use-case-errors';

export interface RefreshAuthenticationUseCasePayload {
  refreshToken: string;
}

@injectable()
export class RefreshAuthenticationUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    public authenticationRepository: AuthenticationRepository,

    @inject(TYPES.AuthenticationTokenManger)
    public authenticationTokenManager: AuthenticationTokenManager
  ) {}

  async execute(useCasePayload: RefreshAuthenticationUseCasePayload) {
    this.validatePayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    const decodedPayload = await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken(decodedPayload);
  }

  validatePayload(payload: RefreshAuthenticationUseCasePayload) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error(refreshAuthUseCaseErrors.NOT_CONTAIN_REFRESH_TOKEN);
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(refreshAuthUseCaseErrors.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
