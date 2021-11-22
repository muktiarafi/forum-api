import { inject, injectable } from 'inversify';
import { AuthenticationRepository } from '../../Domains/authentications/authentication-repository';
import { NewAuth } from '../../Domains/authentications/entities/new-auth';
import { UserLogin } from '../../Domains/users/entities/user-login';
import { UserRepository } from '../../Domains/users/user-repository';
import TYPES from '../../Infrastructures/types';
import { AuthenticationTokenManager } from '../security/authentication-token-manager';
import { PasswordHash } from '../security/password-hash';

export interface LoginUserUseCasePayload {
  username: string;
  password: string;
}

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    public userRepository: UserRepository,

    @inject(TYPES.AuthenticationRepository)
    public authenticationRepository: AuthenticationRepository,

    @inject(TYPES.AuthenticationTokenManger)
    public authenticationTokenManager: AuthenticationTokenManager,

    @inject(TYPES.PasswordHash)
    public passwordHash: PasswordHash
  ) {}

  async execute(useCasePayload: LoginUserUseCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const hash = await this.userRepository.getPasswordByUsername(username);

    await this.passwordHash.comparePassword(password, hash);

    const { id } = await this.userRepository.getUserByUsername(username);

    const accessToken = await this.authenticationTokenManager.createAccessToken({ username, id });
    const refreshToken = await this.authenticationTokenManager.createRefreshToken({
      username,
      id,
    });

    await this.authenticationRepository.addToken(refreshToken);

    const authenticaiton = new NewAuth({
      accessToken,
      refreshToken,
    });

    return authenticaiton;
  }
}
