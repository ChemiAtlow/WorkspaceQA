import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { initialize } from 'passport';
import cors from 'cors';

import { Controller } from './controllers/controller.model';
import { errorMiddleware } from './middleware/error.middleware';
import { appLogger, LogStream } from './services';

export class App {
    public readonly app: Application;

    constructor(controllers: Controller[], public readonly port: number) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(cookieParser());
        this.app.use('*', cors());
        this.app.use(morgan('dev', { stream: new LogStream()}));
        this.app.use(urlencoded({ extended: false }));
        this.app.use(json());
        this.app.use(initialize());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            appLogger.debug(`Server started listening on the port ${this.port}`);
        });
    }
}
