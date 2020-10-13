import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

export function errorMiddleware(err: HttpException, _: Request, res: Response, _1: NextFunction) {
    const { status = 500, message = 'Somthing went wrong' } = err;
    res.status(status).send({
        status,
        message,
    });
}
