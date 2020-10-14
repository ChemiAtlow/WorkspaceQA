import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class UserNotFoundException extends HttpException {
    constructor(email: string) {
        super(HTTPStatuses.notFound, `user with email: ${email} not found!`);
    }
}
