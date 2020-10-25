import { NextFunction, Request, Response } from 'express';

export const paramMiddleware = (name: string) => {
    return (req: Request, res: Response, next: NextFunction, arg: string) => {
        req[name] = arg;
        next();
    };
};
