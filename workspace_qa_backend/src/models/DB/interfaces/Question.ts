import { Document, Model } from 'mongoose';
import { IProjectDocumnet } from './Project';
import { IResponseDocumnet } from './Response';

export interface IQuestion {
    title: string;
    filePath: string;
    state: 'Initial' | 'Answered' | 'Accepted' | 'Closed';
    project: IProjectDocumnet['_id'];
    question: IResponseDocumnet['_id'];
    answers: IResponseDocumnet['_id'][];
    answerCount: number;
}

//Methods - if needed.
export interface IQuestionDocumnet extends Document, IQuestion {}

//Static methods - if needed.
export interface IQuestionModel extends Model<IQuestionDocumnet> {}
