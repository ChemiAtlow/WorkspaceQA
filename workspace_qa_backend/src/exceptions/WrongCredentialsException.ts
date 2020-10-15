import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class WrongCredentialsException extends HttpException {
    constructor() {
        super(HTTPStatuses.unauthorized, `No user with this credentials was found!`);
    }
}
