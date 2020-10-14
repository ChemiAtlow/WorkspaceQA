import { Request, Response, Router } from 'express';
import { HttpException, UserNotFoundException } from '../exceptions';
import { Controller } from './controller.model';

const users = [
    { name: 'Ron', age: 12, id: '32505CEA92D446B4B72B83DD77C60974' },
    { name: 'Avi', age: 37, id: '0A9AF10AF2264740B75AAF7FAF0F4FDB' },
    { name: 'Ben', age: 34, id: '2D5C3596278243659E96C79EBD324727' },
    { name: 'Eli', age: 97, id: '096DC153EF01454CB5E3371A9E71F582' },
    { name: 'Bar', age: 67, id: 'C83F625B1CEC4E13B50842D77903296C' },
    { name: 'Mor', age: 48, id: 'BA536B108ABC4628B192C341DD41310C' },
];

export class UsersController extends Controller {
    public path: string = '/users';
    protected intializeRoutes(): void {
        this.router.get('/', this.getAll);
        this.router.get('/:userId', this.getSpecific);
    }
    constructor() {
        super();
    }
    getAll(_: Request, res: Response) {
        res.send(users);
    }

    getSpecific(req: Request<{ userId: string }>, res: Response) {
        let {
            params: { userId },
        } = req;
        userId = userId.trim();
        if (!userId) {
            throw new HttpException(400, 'No user ID provided');
        }
        const user = users.filter((user) => user.id === userId);
        if (user.length < 1) {
            throw new UserNotFoundException(userId);
        }
        res.send(user[0]);
    }
}