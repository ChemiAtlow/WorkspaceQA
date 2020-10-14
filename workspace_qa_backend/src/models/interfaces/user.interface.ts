import { Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    username: string;
    birthday?: string;
    job?: string;

    comparePassword(password: string): Promise<boolean>;
}
