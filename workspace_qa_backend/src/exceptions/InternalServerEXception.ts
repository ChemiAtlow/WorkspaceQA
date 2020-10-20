import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class InternalServerException extends HttpException {
    constructor(data: string) {
        super(HTTPStatuses.internalServerError, `Internal server error: ${data}`);
    }
}
