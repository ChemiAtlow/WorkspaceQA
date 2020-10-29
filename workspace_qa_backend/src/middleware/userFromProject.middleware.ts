import { NextFunction, Request, Response } from 'express';
import { InternalServerException, UnauthorizedException } from '../exceptions';
import { isUserFromProject } from '../services';

export const userFromProjectMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const { user, projectId, params } = req;
    const projId = projectId || params.projectId;
    if (user === undefined) {
        throw new InternalServerException('An error happened with authentication');
    }
    if (!isUserFromProject(user, projId)) {
        throw new UnauthorizedException('You are not a part of this project!');
    }
    next();
};
