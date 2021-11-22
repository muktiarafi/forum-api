import { Request, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'inversify';
import { AddUserUseCase, AddUserUseCasePayload } from '../../../../Applications/use_case/add-user-use-case';
import TYPES from '../../../../Infrastructures/types';

export class UsersHandler {
  constructor(public container: Container) {}

  postUserHandler = async (request: Request, h: ResponseToolkit) => {
    const addUserUseCase = this.container.get<AddUserUseCase>(TYPES.AddUserUseCase);
    const addedUser = await addUserUseCase.execute(request.payload as AddUserUseCasePayload);

    return h
      .response({
        status: 'success',
        data: {
          addedUser,
        },
      })
      .code(201);
  };
}
