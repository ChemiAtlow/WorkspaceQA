import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
    constructor(data: string) {
        super(HTTPStatuses.unauthorized, `Unauthorized request denied: ${data}`);
    }
}
