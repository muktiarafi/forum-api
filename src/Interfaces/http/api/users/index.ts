import { IPlugin } from '../types/plugin';
import { UsersHandler } from './handler';
import { routes } from './routes';

export const users: IPlugin = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);

    server.route(routes(usersHandler));
  },
};
