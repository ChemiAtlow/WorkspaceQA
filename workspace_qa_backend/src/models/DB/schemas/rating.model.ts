import { Schema, model } from 'mongoose';

import { IRatingDocumnet, IRatingModel } from '../interfaces';

const ratingSchema = new Schema<IRatingDocumnet>({
    vote: {
        type: String,
        enum: ['up', 'down'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    response: {
        type: Schema.Types.ObjectId,
        ref: 'Responses',
    },
});

export const ratingModel = model<IRatingDocumnet, IRatingModel>('Ratings', ratingSchema);
