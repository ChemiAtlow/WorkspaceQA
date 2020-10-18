import { Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

import { IUserModel, IUserDocumnet, IUser } from '../interfaces';
import { appLogger } from '../../services';

const userSchema = new Schema<IUserDocumnet>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
    },
    githubId: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        trim: true,
    },
});

// post saving user
userSchema.post<IUserDocumnet>('save', function (user, next) {
    appLogger.debug(`new user saved: ${user._id} - ${user.username}`);
    next();
});

userSchema.statics.findOrCreate = async function (profile: IUser) {
    const user = await userModel.findOne({ ...profile });
    if (user) {
        return user;
    }
    return await userModel.create(profile);
};

// pass passport-local-mongoose plugin in order to handle password hashing
userSchema.plugin(passportLocalMongoose);

export const userModel = model<IUserDocumnet, IUserModel>('User', userSchema);
