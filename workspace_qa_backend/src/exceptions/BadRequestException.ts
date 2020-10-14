import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
    constructor(data: string) {
        super(HTTPStatuses.clientError, `Bad request: ${data}`);
    }
}
