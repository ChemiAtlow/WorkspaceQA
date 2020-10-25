import { config as dotenvConfig } from 'dotenv';
import { App } from './app';
import {
    authController,
    projectsControllers,
    questionsController,
    userControllers,
} from './controllers';
import { Controller } from './controllers/controller.model';
import { passportConfig } from './services';

dotenvConfig();

passportConfig();

const port = parseInt(process.env.PORT ?? '3000');

const app = new App(
    [
        new Controller('/users', userControllers),
        new Controller('/auth', authController),
        new Controller('/projects', projectsControllers),
        new Controller('/questions/:projectId', questionsController),
    ],
    port
);

app.listen();
