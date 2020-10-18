import { IncomingHttpHeaders } from 'http';
import { sign, verify } from 'jsonwebtoken';
import { IUserDocumnet } from '../models/DB/interfaces';
import { IDataInJwtToken, IJwtTokenData } from '../models/interfaces';
import { appLogger } from './appLogger.service';

export const createJWTToken = (user: IUserDocumnet) => {
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
        appLogger.warning('Invalid token', error);
        return false;
    }
};

export const retrieveJWTToken = (headers: IncomingHttpHeaders) => {
    if (headers?.authorization) {
        const tokens = headers.authorization.split(' ');
        if (tokens?.length === 2) {
            return tokens[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

const createCookieData = (tokenData: IJwtTokenData) =>
    `Authorization=jwt ${tokenData.token}; Max-Age=${tokenData.expiresIn}`;
