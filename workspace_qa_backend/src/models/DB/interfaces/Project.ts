import { Document, Model } from 'mongoose';
import { IQuestionDocumnet, IUserDocumnet } from '.';

export interface IProject {
    name: string;
    owner: IUserDocumnet['_id'];
    archived?: boolean;
}

//Methods - if needed.
export interface IProjectDocumnet extends Document, IProject {
    //archive(): Promise<string[]>;
}

//Static methods - if needed.
export interface IProjectModel extends Model<IProjectDocumnet> {}
