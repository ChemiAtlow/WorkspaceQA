import { Schema, model, Types } from 'mongoose';

import { IUserModel, IUserDocumnet, IUser } from '../interfaces';
import { appLogger } from '../../../services';

const userSchema = new Schema<IUserDocumnet>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    githubId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
        trim: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    projects: [
        {
            ref: 'Projects',
            type: Schema.Types.ObjectId,
        },
    ],
});

// post saving user
userSchema.post<IUserDocumnet>('save', function (user, next) {
    appLogger.debug(`User saved: ${user._id} - ${user.username}`);
    next();
});

userSchema.statics.findOrCreate = async function (profile: IUser) {
    const { githubId, username, accessToken } = profile;
    const user = await userModel.findOne({ githubId, username });
    if (user) {
        if (user.accessToken !== accessToken) {
            user.accessToken = accessToken;
            return await user.save();
        }
        return user;
    }
    return await userModel.create(profile);
};

userSchema.statics.removeProjectIfExists = async function (
    id: Types.ObjectId,
    projectId: Types.ObjectId
) {
    const user = await userModel.findById(id);
    if (user) {
        user.projects = user.projects.filter((prj) => !projectId.equals(prj));
        return user.save();
    }
};

export const userModel = model<IUserDocumnet, IUserModel>('Users', userSchema);
