import { Schema, model } from 'mongoose';

import { IQuestionDocumnet, IQuestionModel } from '../interfaces';
import { appLogger } from '../../../services';

const commonResponse = {
    message: {
        type: String,
        required: true,
        trim: true,
    },
    edited: {
        type: Boolean,
        default: false,
    },
    revisions: [
        {
            type: String,
            required: false,
        },
    ],
    ratings: {
        total: {
            type: Number,
            default: 0,
        },
        votes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users',
                },
                vote: {
                    type: String,
                    enum: ['up, down'],
                },
            },
        ],
    },
    user: {
        _id: {
            ref: 'User',
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
    },
};

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
        state: {
            type: String,
            enum: ['New', 'Answered', 'Accepted', 'Closed'],
            default: 'New',
        },
        project: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        question: commonResponse,
        answers: [commonResponse],
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
