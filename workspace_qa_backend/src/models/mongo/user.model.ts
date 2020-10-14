import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import passportLocalMongoose from 'passport-local-mongoose';
import { IUser } from '../interfaces';
import { HttpException } from '../../exceptions';
import { appLogger } from '../../services';

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    birthday: String,
    job: String,
});

//Hahs password before save if needed
userSchema.pre<IUser>('save', async function (next) {
    const user = this;
    try {
        // only hash the password if it has been modified (or is new)
        if (this.isModified('password') || this.isNew) {
            const salt = await genSalt(10);
            const hashRes = await hash(user.password, salt);
            // override the cleartext password with the hashed one
            user.password = hashRes;
        }
        return next();
    } catch (error) {
        return next(error);
    }
});

// post saving user
userSchema.post<IUser>('save', function (user, next) {
    appLogger.debug(`new user saved: ${user._id} - ${user.username}`);
    next();
});

// compare password
userSchema.methods.comparePassword = async function (password: string) {
    try {
        return await compare(password, this.password);
    } catch (error) {
        throw new HttpException(500, 'An error occoured when checking password');
    }
};

// pass passport-local-mongoose plugin in order to handle password hashing
userSchema.plugin(passportLocalMongoose);

export const userModel = model<IUser>('User', userSchema);
