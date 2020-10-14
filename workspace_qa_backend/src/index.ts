import { config as dotenvConfig } from 'dotenv';
import { App } from './app';
import { authController, userControllers } from './controllers';
import { Controller } from './controllers/controller.model';

dotenvConfig();

const port = parseInt(process.env.PORT ?? '3000');

const app = new App(
    [new Controller('/users', userControllers), new Controller('/auth', authController)],
    port
);

app.listen();
