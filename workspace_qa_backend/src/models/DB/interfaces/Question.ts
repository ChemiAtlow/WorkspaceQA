import { Document, Model } from 'mongoose';
import { IResponse } from '.';
import { IProjectDocumnet } from './Project';

export interface IQuestion {
    title: string;
    filePath: string;
    state: 'Initial' | 'Answered' | 'Accepted' | 'Closed';
    project: IProjectDocumnet['_id'];
    question: IResponse;
    answers: IResponse[];
    answerCount: number;
}

//Methods - if needed.
export interface IQuestionDocumnet extends Document, IQuestion {}

//Static methods - if needed.
export interface IQuestionModel extends Model<IQuestionDocumnet> {}
