import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { authenticate } from 'passport';
import { IConroller } from '../models/interfaces';

type AsyncEndpointWrapper = (
    fn: RequestHandler<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

export class Controller {
    public readonly router = Router();
    constructor(public readonly path: string, private readonly controllers: IConroller) {
        this.intializeRoutes();
    }
    private intializeRoutes() {
        for (const key in this.controllers) {
            const { controller, method, path, authSafe, middleware } = this.controllers[key];
            const handlers: RequestHandler[] = [];
            if (authSafe) {
                handlers.push(authenticate('jwt', { session: false }));
            }
            if (middleware) {
                handlers.push(...middleware);
            }
            const isAsync = controller.constructor.name === 'AsyncFunction';
            handlers.push(isAsync ? this.asyncWrapper(controller) : controller);
            this.router[method]?.(path, ...handlers);
        }
    }
    private asyncWrapper: AsyncEndpointWrapper = (fn) => (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch(next);
}
