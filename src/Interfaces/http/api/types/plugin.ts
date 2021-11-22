import { Server } from '@hapi/hapi';
import { Container } from 'inversify';

interface IPluginOptions {
  container: Container;
}

export interface IPlugin {
  name: string;
  register(server: Server, options: IPluginOptions): Promise<void>;
}
