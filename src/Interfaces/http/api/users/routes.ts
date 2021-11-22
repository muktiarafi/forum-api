import { ServerRoute } from '@hapi/hapi';
import { UsersHandler } from './handler';

export const routes = (handler: UsersHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];
