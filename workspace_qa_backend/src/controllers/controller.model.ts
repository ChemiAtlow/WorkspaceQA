import { NextFunction, Request, RequestHandler, Response, Router } from 'express';

type AsyncEndpointWrapper = (
    fn: RequestHandler<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
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
            const isAsync = controller.constructor.name === 'AsyncFunction';
            const asyncWrapper: AsyncEndpointWrapper = (fn) => (req, res, next) =>
                Promise.resolve(fn(req, res, next)).catch(next);
            this.router[method](path, isAsync ? asyncWrapper(controller) : controller);
        }
    }
}
