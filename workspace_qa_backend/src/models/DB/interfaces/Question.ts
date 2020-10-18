import { Document, Model } from 'mongoose';
import { IResponse } from '.';

export interface IQuestion {
    title: string;
    filePath: string;
    state: 'Initial' | 'Answered' | 'Accepted' | 'Closed';
    question: IResponse;
    answers: IResponse[];
}

//Methods - if needed.
export interface IQuestionDocumnet extends Document, IQuestion {}

//Static methods - if needed.
export interface IQuestionModel extends Model<IQuestionDocumnet> {}
