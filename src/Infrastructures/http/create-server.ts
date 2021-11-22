import * as Hapi from '@hapi/hapi';
import * as Jwt from '@hapi/jwt';
import { Boom } from '@hapi/boom';
import { Container } from 'inversify';

import { ClientError } from '../../Commons/exceptions/client-error';
import { DomainErrorTranslator } from '../../Commons/exceptions/domain-error-translator';
import { users } from '../../Interfaces/http/api/users';
import { authentications } from '../../Interfaces/http/api/authentications';
import { threads } from '../../Interfaces/http/api/threads';

export const createServer = async (container: Container) => {
  const server = new Hapi.Server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: Jwt.plugin,
    },
  ]);

  server.auth.strategy('token', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate: (artifacts: any) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: translatedError.message,
          })
          .code(translatedError.statusCode);
      }

      if (translatedError instanceof Boom && !translatedError.isServer) {
        return h.continue;
      }

      return h
        .response({
          status: 'error',
          message: 'Internal server error',
        })
        .code(500);
    }

    return h.continue;
  });

  return server;
};
