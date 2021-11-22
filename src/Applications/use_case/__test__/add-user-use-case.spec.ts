import { RegisterUser } from '../../../Domains/users/entities/register-user';
import { RegisteredUser } from '../../../Domains/users/entities/registered-user';
import { UserRepository } from '../../../Domains/users/user-repository';
import { PasswordHash } from '../../security/password-hash';
import { AddUserUseCase } from '../add-user-use-case';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      username: 'bambank',
      password: '12345678',
      fullname: 'buambank',
    };

    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-1',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = <UserRepository>{};
    const mockPasswordHash = <PasswordHash>{};

    mockUserRepository.verifyAvailableUsername = jest.fn().mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('encrypted'));
    mockUserRepository.addUser = jest.fn(() => Promise.resolve(expectedRegisteredUser));

    const getUserUseCase = new AddUserUseCase(mockUserRepository, mockPasswordHash);
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted',
        fullname: useCasePayload.fullname,
      })
    );
  });
});
