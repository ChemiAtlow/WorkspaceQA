import { IUserDocumnet } from './models/DB/interfaces';

declare global {
    namespace Express {
        interface User extends IUserDocumnet {}
        interface Request {
            [key: string]: string;
        }
    }
}
