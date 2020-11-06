import { Schema, model } from 'mongoose';

import { IResponseDocumnet, IResponseModel } from '../interfaces';

const responseSchema = new Schema<IResponseDocumnet>({
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
    rating: {
        type: Number,
        default: 0,
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
});

export const responseModel = model<IResponseDocumnet, IResponseModel>('Responses', responseSchema);
