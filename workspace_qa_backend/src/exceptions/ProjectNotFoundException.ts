import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

export class ProjectNotFoundException extends HttpException {
    constructor(id: string) {
        super(HTTPStatuses.notFound, `requested project (${id}) was not found!`);
    }
}
