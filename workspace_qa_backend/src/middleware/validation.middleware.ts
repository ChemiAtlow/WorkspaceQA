import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HTTPStatuses } from '../constants';
import { HttpException } from '../exceptions';

export function validationMiddleware<T>(type: { new (): T }): RequestHandler {
    return (req, _, next) => {
        validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message = errors
                    .map((error: ValidationError) => Object.values(error.constraints || []))
                    .join(', ');
                next(new HttpException(HTTPStatuses.clientError, message));
            } else {
                next();
            }
        });
    };
}
