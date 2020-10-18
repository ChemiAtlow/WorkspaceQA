import { Document, Model } from 'mongoose';

export interface IUser {
    githubId: number;
    username: string;
    avatar: string;
    email: string;
    name: string;
    accessToken: string;
}

export interface IUserDocumnet extends Document, IUser {}

export interface IUserModel extends Model<IUserDocumnet> {
    findOrCreate(profile: IUser): Promise<IUserDocumnet>;
}
