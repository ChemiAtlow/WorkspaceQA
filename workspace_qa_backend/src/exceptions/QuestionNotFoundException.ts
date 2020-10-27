import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class QuestionNotFoundException extends HttpException {
    constructor(id: string) {
        super(HTTPStatuses.notFound, `requested user (${id}) was not found!`);
    }
}