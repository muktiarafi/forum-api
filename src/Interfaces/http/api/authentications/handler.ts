import { ResponseToolkit } from '@hapi/hapi';
import { Container } from 'inversify';
import { LoginUserUseCase } from '../../../../Applications/use_case/login-user-use-case';
import { LogoutUserUseCase } from '../../../../Applications/use_case/logout-use-case';
import { RefreshAuthenticationUseCase } from '../../../../Applications/use_case/refresh-authentication-use-case';
import TYPES from '../../../../Infrastructures/types';
import {
  IDeleteAuthenticationRequest,
  IPostAuthenticationRequest,
  IPutAuthenticationRequest,
} from './types/authentication-handler-request';

export class AuthenticationsHandler {
  constructor(public container: Container) {}

  postAuthenticationHandler = async (request: IPostAuthenticationRequest, h: ResponseToolkit) => {
    const loginUserUseCase = this.container.get<LoginUserUseCase>(TYPES.LoginUseCase);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  };

  putAuthenticationHandler = async (request: IPutAuthenticationRequest, h: ResponseToolkit) => {
    const refreshAuthenticationUseCase = this.container.get<RefreshAuthenticationUseCase>(
      TYPES.RefreshAuthenticationUseCase
    );
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
        },
      })
      .code(200);
  };

  deleteAuthenticationHandler = async (request: IDeleteAuthenticationRequest, h: ResponseToolkit) => {
    const logoutUserUseCase = this.container.get<LogoutUserUseCase>(TYPES.LogoutUseCase);
    await logoutUserUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
      })
      .code(200);
  };
}
