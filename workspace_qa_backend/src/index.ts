import { config as dotenvConfig } from 'dotenv';
import { App } from './app';
import { UsersController } from './controllers';

dotenvConfig();

const port = parseInt(process.env.PORT ?? '3000');

const app = new App([new UsersController()], port);

app.listen();
