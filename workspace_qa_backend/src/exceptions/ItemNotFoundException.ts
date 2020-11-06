import { HTTPStatuses } from '../constants';
import { HttpException } from './HttpException';

type ItemTypes = 'project' | 'answer' | 'question' | 'rating';

export class ItemNotFoundException extends HttpException {
    constructor(type: ItemTypes, id: string) {
        super(HTTPStatuses.notFound, `requested ${type} (${id}) was not found!`);
    }
}
