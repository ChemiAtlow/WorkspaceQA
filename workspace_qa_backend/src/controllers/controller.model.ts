import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { authenticate } from 'passport';

type AsyncEndpointWrapper = (
    fn: RequestHandler<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

export type Endpoint = {
    path: string;
    method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'use';
    authSafe?: boolean;
    controller: RequestHandler<any>;
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
            const { controller, method, path, authSafe } = this.controllers[key];
            const handlers: RequestHandler[] = [];
            if (authSafe) {
                handlers.push(authenticate('jwt', { session: false }));
            }
            const isAsync = controller.constructor.name === 'AsyncFunction';
            handlers.push(isAsync ? this.asyncWrapper(controller) : controller);
            this.router[method](path, handlers);
        }
    }
    private asyncWrapper: AsyncEndpointWrapper = (fn) => (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch(next);
}
