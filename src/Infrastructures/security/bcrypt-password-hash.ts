import { inject, injectable } from 'inversify';
import { PasswordHash } from '../../Applications/security/password-hash';
import { AuthenticationError } from '../../Commons/exceptions/authentication-error';
import TYPES from '../types';

interface IBcrypt {
  hash(password: string, saltRound: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

@injectable()
export class BcryptPasswordHash implements PasswordHash {
  constructor(@inject(TYPES.Bcrypt) public bcrypt: IBcrypt, @inject(TYPES.Salt) public saltRound = 12) {}

  async hash(password: string) {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async comparePassword(password: string, hash: string) {
    const result = await this.bcrypt.compare(password, hash);

    if (!result) {
      throw new AuthenticationError('Bad credential');
    }
  }
}
