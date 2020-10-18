import { Schema, model } from 'mongoose';

import { IProjectDocumnet, IProjectModel } from '../interfaces';
import { appLogger } from '../../../services';

const projectSchema = new Schema<IProjectModel>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    users: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            name: String,
            avatar: String,
            role: { type: String, enum: ['Owner', 'Admin', 'User'] },
        },
    ],
    questions: [
        {
            ref: 'Questions',
            type: Schema.Types.ObjectId,
        },
    ],
});

// post saving user
projectSchema.post<IProjectDocumnet>('save', function (project, next) {
    appLogger.debug(`new project saved: ${project.name} - ${project._id}`);
    next();
});

export const projectModel = model<IProjectDocumnet, IProjectModel>('Projects', projectSchema);
