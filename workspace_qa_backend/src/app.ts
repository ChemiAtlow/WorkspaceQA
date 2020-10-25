import cors from 'cors';
import morgan from 'morgan';
import express, { Application } from 'express';
import { json, urlencoded } from 'body-parser';
import { initialize } from 'passport';

import { Controller } from './controllers';
import { errorMiddleware, paramMiddleware } from './middleware';
import { appLogger, init, LogStream, mongoDBConnect } from './services';

export class App {
    public readonly app: Application;

    constructor(controllers: Controller[], public readonly port: number) {
        this.app = express();

        this.connectToDatabase();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use('*', cors({ credentials: true }));
        this.app.use(morgan('dev', { stream: new LogStream() }));
        this.app.use(urlencoded({ extended: false }));
        this.app.use(json());
        this.app.use(initialize());
        this.app.param('projectId', paramMiddleware('projectId'));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }

    private async connectToDatabase() {
        appLogger.info('Starting connection to mongo');
        await mongoDBConnect();
    }

    public listen() {
        const server = this.app.listen(this.port, () => {
            appLogger.debug(`Server started listening on the port ${this.port}`);
        });
        init(server).on('connection', (socket) => {
            socket.on('subscribe', (roomData) => {
                socket.leave(`user${roomData.from}`);
                socket.join(`user${roomData.to}`);
            });
        });
    }
}
