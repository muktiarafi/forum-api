import { RegisterUser } from './entities/register-user';
import { RegisteredUser } from './entities/registered-user';

export interface UserRepository {
  addUser(registerUser: RegisterUser): Promise<RegisteredUser>;
  verifyAvailableUsername(username: string): Promise<void>;
  getUserByUsername(username: string): Promise<RegisteredUser>;
  getPasswordByUsername(username: string): Promise<string>;
}
