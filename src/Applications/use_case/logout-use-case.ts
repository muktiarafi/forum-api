import { inject, injectable } from 'inversify';
import { AuthenticationRepository } from '../../Domains/authentications/authentication-repository';
import TYPES from '../../Infrastructures/types';
import { logoutUseCaseErrors } from './constant/logout-use-case-errors';

export interface LogoutUserUseCasePayload {
  refreshToken: string;
}

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    public authenticationRepository: AuthenticationRepository
  ) {}

  async execute(useCasePayload: LogoutUserUseCasePayload) {
    this.validatePayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    await this.authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }

  validatePayload(payload: LogoutUserUseCasePayload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error(logoutUseCaseErrors.NOT_CONTAIN_REFRESH_TOKEN);
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(logoutUseCaseErrors.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
