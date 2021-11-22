import bcrypt from 'bcrypt';

import { AuthenticationError } from '../../../Commons/exceptions/authentication-error';
import { BcryptPasswordHash } from '../bcrypt-password-hash';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPassword = await bcryptPasswordHash.hash('pt');

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('pt');
      expect(spyHash).toBeCalledWith('pt', 12);
    });
  });

  describe('comparePassword function', () => {
    it('should trow AuthenticationError if password not match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(bcryptPasswordHash.comparePassword('one', 'two')).rejects.toThrow(AuthenticationError);
    });

    it('should not throw AuthenticationError if password is match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const password = 'secret';
      const hash = await bcryptPasswordHash.hash(password);

      await expect(bcryptPasswordHash.comparePassword(password, hash)).resolves.not.toThrow(AuthenticationError);
    });
  });
});
