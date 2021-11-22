import { AuthCredentials, Request, RequestAuth } from '@hapi/hapi';

export interface ICredentials extends AuthCredentials {
  id: string;
}

export interface IRequestAuth extends RequestAuth {
  credentials: ICredentials;
}

export interface IRequest extends Request {
  auth: IRequestAuth;
}
