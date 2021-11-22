import { IRequest } from '../../types/request';

export interface IPostAuthenticationRequest extends IRequest {
  payload: {
    username: string;
    password: string;
  };
}

export interface IPutAuthenticationRequest extends IRequest {
  payload: {
    refreshToken: string;
  };
}

export interface IDeleteAuthenticationRequest extends IRequest {
  payload: {
    refreshToken: string;
  };
}
