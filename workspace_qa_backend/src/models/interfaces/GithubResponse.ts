/* eslint-disable @typescript-eslint/naming-convention */
export type GithubCodeResponse = {
    error?: string;
    error_description?: string;
    error_uri?: string;
    access_token?: string;
    token_type?: string;
    scope?: string;
};

export type GithubAccessTokenData = {
    accessToken: string;
    tokenType: string;
};

export type GithubAccessTokenResponse = {
    login: string;
    id: number;
    avatar_url: string;
    name: string;
    email: string;
};

export type GithubEmailResponse = {
    email: string;
    primary: boolean;
    verifired: boolean;
};
