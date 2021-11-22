import { inject, injectable } from 'inversify';
import { RegisterUser } from '../../Domains/users/entities/register-user';
import { UserRepository } from '../../Domains/users/user-repository';
import TYPES from '../../Infrastructures/types';
import { PasswordHash } from '../security/password-hash';

export interface AddUserUseCasePayload {
  username: string;
  password: string;
  fullname: string;
}

@injectable()
export class AddUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) public userRepository: UserRepository,
    @inject(TYPES.PasswordHash) public passwordHash: PasswordHash
  ) {}

  async execute(useCasePayload: AddUserUseCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this.userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this.passwordHash.hash(registerUser.password);

    return this.userRepository.addUser(registerUser);
  }
}
