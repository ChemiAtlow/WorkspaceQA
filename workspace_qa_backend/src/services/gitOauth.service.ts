import axios from 'axios';
import { HTTPStatuses } from '../constants';
import { BadRequestException, HttpException, InternalServerException } from '../exceptions';
import {
    GithubCodeResponse,
    GithubAccessTokenData,
    GithubAccessTokenResponse,
    GithubEmailResponse,
} from '../models/interfaces';
import { appLogger } from './appLogger.service';

const getGithubAccessToken = async (code: string) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const {
        GITHUB_APP_CLIENT_ID: client_id,
        GITHUB_APP_CLIENT_SECRET: client_secret,
    } = process.env;
    try {
        const result = await axios.post<GithubCodeResponse>(
            'https://github.com/login/oauth/access_token',
            { client_id, client_secret, code },
            { headers: { Accept: 'application/json' } }
        );
        if (result.data.error) {
            throw new InternalServerException('Invalid code!');
        }
        const { access_token: accessToken = '', token_type: tokenType = '' } = result.data;
        return { accessToken, tokenType };
    } catch (error) {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new InternalServerException('Issue retrieving the access token!');
    }
};

const getGithubUserData = async ({ accessToken, tokenType }: GithubAccessTokenData) => {
    try {
        const res = await axios.get<GithubAccessTokenResponse>('https://api.github.com/user', {
            headers: { Authorization: `${tokenType} ${accessToken}` },
        });
        if (res.status === 401) {
            throw new Error();
        }
        return res.data;
    } catch (err) {
        appLogger.error('error while getting user details!', err);
        throw new InternalServerException('error while getting user details!');
    }
};

const getGihubPrivateEmail = async ({ accessToken, tokenType }: GithubAccessTokenData) => {
    try {
        const res = await axios.get<GithubEmailResponse[]>('https://api.github.com/user/emails', {
            headers: { Authorization: `${tokenType} ${accessToken}` },
        });
        return res.data;
    } catch (err) {
        appLogger.error('error while getting user details!', err);
        throw new InternalServerException('error while getting user details!');
    }
};

export const getUserDataFromCallback = async (code: string) => {
    if (!code) {
        throw new BadRequestException('No callback code recieved!');
    }
    const accessTokenResult = await getGithubAccessToken(code);
    const userData = await getGithubUserData(accessTokenResult);
    // Private email fallback.
    if (!userData.email) {
        const emails = await getGihubPrivateEmail(accessTokenResult);
        const primaryEmail = emails.find((email) => email.primary);
        userData.email = primaryEmail?.email || '';
    }
    return { ...userData, accessToken: accessTokenResult.accessToken };
};
