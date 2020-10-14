import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class UserExistsException extends HttpException {
    constructor(field: string) {
        super(HTTPStatuses.unauthorized, `user with this ${field} already exists!`);
    }
}
