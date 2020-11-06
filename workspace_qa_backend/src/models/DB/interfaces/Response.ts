import { Document, Model } from 'mongoose';
import { IUserDocumnet } from './User';

export interface IResponse {
    message: string;
    edited: boolean;
    revisions: string[];
    rating: number;
    user: {
        _id: IUserDocumnet['_id'];
        name: IUserDocumnet['name'];
        avatar: IUserDocumnet['avatar'];
    };
}

//Methods - if needed.
export interface IResponseDocumnet extends Document, IResponse {}

//Static methods - if needed.
export interface IResponseModel extends Model<IResponseDocumnet> {}
