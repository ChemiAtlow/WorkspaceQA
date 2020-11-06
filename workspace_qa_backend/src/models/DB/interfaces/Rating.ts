import { Document, Model } from 'mongoose';
import { IResponseDocumnet } from './Response';
import { IUserDocumnet } from './User';

export interface IRating {
    vote: 'up' | 'down';
    user: IUserDocumnet['_id'];
    response: IResponseDocumnet['_id'];
}

//Methods - if needed.
export interface IRatingDocumnet extends Document, IRating {}

//Static methods - if needed.
export interface IRatingModel extends Model<IRatingDocumnet> {}
