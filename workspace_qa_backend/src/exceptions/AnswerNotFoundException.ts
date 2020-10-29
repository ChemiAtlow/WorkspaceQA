import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class AnswerNotFoundException extends HttpException {
    constructor(id: string) {
        super(HTTPStatuses.notFound, `requested answer (${id}) was not found!`);
    }
}
