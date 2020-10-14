import { RequestHandler, Router } from 'express';

export type Endpoint = {
    path: string;
    controller: RequestHandler<any>;
    method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'use';
};

export interface IConroller {
    [controllers: string]: Endpoint;
}

export class Controller {
    public readonly router = Router();
    constructor(public readonly path: string, private readonly controllers: IConroller) {
        this.intializeRoutes();
    }
    private intializeRoutes() {
        for (const key in this.controllers) {
            const { controller, method, path } = this.controllers[key];
            this.router[method](path, controller);
        }
    }
}
