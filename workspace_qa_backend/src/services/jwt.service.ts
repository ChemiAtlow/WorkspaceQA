import { sign, verify } from 'jsonwebtoken';
import { HTTPStatuses } from '../constants';
import { HttpException } from '../exceptions';
import { IUserDocumnet } from '../models/DB/interfaces';
import { IDataInJwtToken, IJwtTokenData } from '../models/interfaces';
import { appLogger } from './appLogger.service';

export const createJWTToken = (user: IUserDocumnet) => {
    if (!user._id) {
        throw new HttpException(HTTPStatuses.internalServerError, 'The user is invalid!');
    }
    const secret = process.env.JWT_SECRET_OR_KEY ?? '';
    const expiresIn = process.env.JWT_TOKEN_EXPIRATION
        ? parseInt(process.env.JWT_TOKEN_EXPIRATION)
        : 18000000;
    const dataInJwtToken: IDataInJwtToken = {
        _id: user._id,
    };
    const tokenData: IJwtTokenData = {
        expiresIn,
        token: sign(dataInJwtToken, secret, { expiresIn }),
    };
    return createCookieData(tokenData);
};

export const isValidJWTToken = (token: string) => {
    try {
        verify(token, process.env.JWT_SECRET_OR_KEY || '');
        return true;
    } catch (error) {
        appLogger.warn('Invalid token', error);
        return false;
    }
};

const createCookieData = (tokenData: IJwtTokenData) =>
    `Authorization=jwt ${tokenData.token}; Max-Age=${tokenData.expiresIn}`;
