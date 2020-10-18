import { Document, Model } from 'mongoose';

export interface IUser {
    githubId: string;
    username: string;
    profileUrl: string;
    avatar: string;
    email?: string;
}

export interface IUserDocumnet extends Document, IUser {}

export interface IUserModel extends Model<IUserDocumnet> {
    findOrCreate(profile: IUser): Promise<IUserDocumnet>;
}
