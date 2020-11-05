import { Schema, model } from 'mongoose';

import { IQuestionDocumnet, IQuestionModel } from '../interfaces';
import { appLogger } from '../../../services';

const questionSchema = new Schema<IQuestionDocumnet>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        filePath: {
            type: String,
            required: true,
            trim: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        state: {
            type: String,
            enum: ['New', 'Answered', 'Accepted', 'Closed'],
            default: 'New',
        },
        question: {
            ref: 'Responses',
            type: Schema.Types.ObjectId,
            required: true,
        },
        answers: [
            {
                ref: 'Responses',
                type: Schema.Types.ObjectId,
                required: true,
            },
        ],
        acceptedAnswer: {
            ref: 'Responses',
            type: Schema.Types.ObjectId,
        },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

questionSchema.virtual('answerCount').get(function (this: IQuestionDocumnet) {
    return this.answers.length;
});

// post saving question
questionSchema.post<IQuestionDocumnet>('save', function (question, next) {
    appLogger.debug(`Questions saved: ${question.title} - ${question._id}`);
    next();
});

export const questionModel = model<IQuestionDocumnet, IQuestionModel>('Questions', questionSchema);
