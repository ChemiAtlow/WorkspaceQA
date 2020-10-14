import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class UserNotFoundException extends HttpException {
    constructor(id: string) {
        super(HTTPStatuses.notFound, `user with id: ${id} not found!`);
    }
}
