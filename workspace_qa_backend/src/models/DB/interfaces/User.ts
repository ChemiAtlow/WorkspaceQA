import { Document, Model, Types } from 'mongoose';
import { IProjectDocumnet } from './Project';

export interface IUser {
    githubId: number;
    username: string;
    avatar: string;
    email: string;
    name: string;
    accessToken: string;
    projects: IProjectDocumnet['_id'][];
}

export interface IUserDocumnet extends Document, IUser {}

export interface IUserModel extends Model<IUserDocumnet> {
    removeProjectIfExists(id: Types.ObjectId, projectId: Types.ObjectId): Promise<void>;
    findOrCreate(profile: IUser): Promise<IUserDocumnet>;
}
