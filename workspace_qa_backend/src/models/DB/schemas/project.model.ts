import { Schema, model } from 'mongoose';

import { IProjectDocumnet, IProjectModel } from '../interfaces';
import { appLogger } from '../../../services';
import { userModel } from './user.model';

const projectSchema = new Schema<IProjectDocumnet>({
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
            role: { type: String, enum: ['Owner', 'Admin', 'User', 'Removed'] },
        },
    ],
    questions: [
        {
            ref: 'Questions',
            type: Schema.Types.ObjectId,
            required: true,
        },
    ],
    archived: {
        type: Boolean,
        required: false,
        default: false,
    },
});

// post saving project
projectSchema.post<IProjectDocumnet>('save', function (project, next) {
    appLogger.debug(`Project saved: ${project.name} - ${project._id}`);
    next();
});

projectSchema.methods.archive = async function () {
    const promises: Promise<any>[] = [];
    const usersChanged: string[] = [];
    this.users.forEach(async (usr) => {
        if (usr.role !== 'Removed') {
            promises.push(userModel.removeProjectIfExists(usr.id, this._id));
            usersChanged.push(usr.id);
        }
    });
    this.archived = true;
    await Promise.all([...promises, this.save()]);
    return usersChanged;
};

export const projectModel = model<IProjectDocumnet, IProjectModel>('Projects', projectSchema);
