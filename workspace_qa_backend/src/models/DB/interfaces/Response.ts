import { IUserDocumnet } from './User';

export interface IResponse {
    message: string;
    edited: boolean;
    versions: string[];
    user: {
        id: IUserDocumnet['_id'];
        name: IUserDocumnet['name'];
        avatar: IUserDocumnet['avatar'];
    };
}
