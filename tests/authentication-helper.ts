/* istanbul ignore file */
import Jwt from '@hapi/jwt';

import { UsersTableTestHelper } from './user-table-test-helper';

export class AuthenticationHelper {
  static async generateAccessToken({ id = 'user-1', username = 'bambank' }) {
    const user = {
      id,
      username,
      fullname: 'buambank',
      password: 'secret',
    };
    await UsersTableTestHelper.addUser(user);

    return Jwt.token.generate(
      {
        id: user.id,
        username: user.username,
      },
      process.env.ACCESS_TOKEN_KEY!
    );
  }
}
