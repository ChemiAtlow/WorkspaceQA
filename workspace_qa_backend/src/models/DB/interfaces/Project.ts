import { Document, Model } from 'mongoose';
import { IQuestionDocumnet, IUserDocumnet } from '.';

export interface IProject {
    name: string;
    users: Array<{
        id: IUserDocumnet['_id'];
        name: IUserDocumnet['name'];
        avatar: IUserDocumnet['avatar'];
        role: 'Owner' | 'Admin' | 'User' | 'Removed';
    }>;
    questions: Array<{ _id: IQuestionDocumnet['_id']; title: string }>;
    archived?: boolean;
}

//Methods - if needed.
export interface IProjectDocumnet extends Document, IProject {
    archive(): Promise<string[]>;
}

//Static methods - if needed.
export interface IProjectModel extends Model<IProjectDocumnet> {}
