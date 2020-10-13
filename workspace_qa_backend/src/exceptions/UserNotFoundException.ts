import { HttpException } from "./HttpException";

export class UserNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `user with id: ${id} not found!`);
    }
}