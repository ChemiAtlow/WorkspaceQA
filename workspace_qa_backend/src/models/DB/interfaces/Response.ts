import { IUserDocumnet } from './User';

export interface IResponse {
    message: string;
    edited: boolean;
    revisions: string[];
    user: {
        _id: IUserDocumnet['_id'];
        name: IUserDocumnet['name'];
        avatar: IUserDocumnet['avatar'];
    };
}
