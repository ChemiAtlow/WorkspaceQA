import { IUserDocumnet } from './User';

export interface IResponse {
    message: string;
    edited: boolean;
    revisions: string[];
    ratings: {
        total: number;
        votes: { user: IUserDocumnet['_id']; vote: 'up' | 'down' }[];
    };
    user: {
        _id: IUserDocumnet['_id'];
        name: IUserDocumnet['name'];
        avatar: IUserDocumnet['avatar'];
    };
}
