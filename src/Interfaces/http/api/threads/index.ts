import { IPlugin } from '../types/plugin';
import { ThreadsHandler } from './handler';
import { routes } from './routes';

export const threads: IPlugin = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);

    server.route(routes(threadsHandler));
  },
};
