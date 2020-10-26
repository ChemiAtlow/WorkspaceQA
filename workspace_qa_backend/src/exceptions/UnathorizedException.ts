import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
    constructor(data: string) {
        super(HTTPStatuses.forbidden, `Unauthorized request denied: ${data}`);
    }
}
