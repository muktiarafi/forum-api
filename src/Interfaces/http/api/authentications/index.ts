import { IPlugin } from '../types/plugin';
import { AuthenticationsHandler } from './handler';
import { routes } from './routes';

export const authentications: IPlugin = {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);

    server.route(routes(authenticationsHandler));
  },
};
