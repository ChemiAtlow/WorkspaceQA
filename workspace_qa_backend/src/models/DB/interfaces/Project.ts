import { Document, Model } from 'mongoose';
import { IUserDocumnet } from './User';

export interface IProject {
    name: string;
    users: Array<{
        id: IUserDocumnet['_id'];
        name: IUserDocumnet['name'];
        avatar: IUserDocumnet['avatar'];
        role: 'Owner' | 'Admin' | 'User';
    }>;
    questions: any;
}

//Methods - if needed.
export interface IProjectDocumnet extends Document, IProject {}

//Static methods - if needed.
export interface IProjectModel extends Model<IProjectDocumnet> {}
