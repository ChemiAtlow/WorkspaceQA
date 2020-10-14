import { HTTPStatuses } from '../constants';

export class HttpException extends Error {
    constructor(public status: HTTPStatuses, public message: string) {
        super(message);
    }
}
