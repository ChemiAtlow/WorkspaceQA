import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { stubRequest, install, uninstall } from 'moxios';
import { HttpException } from '../../exceptions';
import { getUserDataFromCallback } from '../gitOauth.service';
import { appLogger } from '../appLogger.service';

use(chaiAsPromised);

describe('Git oauth tests', () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    appLogger.transports.forEach((t) => (t.silent = true));
    beforeEach(() => install());
    afterEach(() => uninstall());
    const gitPaths = {
        codeCallback: 'https://github.com/login/oauth/access_token',
        getUser: 'https://api.github.com/user',
        getPrivateEmail: 'https://api.github.com/user/emails',
    };
    const responseForInvalidCallbackCode = {
        error: 'bad_verification_code',
    };
    const responseForValidCallbackCode = {
        access_token: 12234,
        token_type: 'bearer',
    };
    const responseForInvalidAccessToken = {
        message: 'Bad credentials',
    };
    const responseForValidAccessToken = {
        login: 'Username',
        id: 1234,
        avatar_url: 'url',
        name: 'name',
        email: 'email',
    };
    it('Should throw if callback code is empty', async () => {
        stubRequest(gitPaths.codeCallback, {
            status: 200,
            response: responseForInvalidCallbackCode,
        });
        await expect(getUserDataFromCallback('')).to.be.rejectedWith(HttpException);
    });
    it('Should throw if accessToken is not a valid token', async () => {
        stubRequest(gitPaths.codeCallback, {
            status: 200,
            response: responseForValidCallbackCode,
        });
        stubRequest(gitPaths.getUser, { status: 401, response: responseForInvalidAccessToken });
        await expect(getUserDataFromCallback('123')).to.be.rejectedWith(HttpException);
    });
    it('Should return user data', async () => {
        stubRequest(gitPaths.codeCallback, {
            status: 200,
            response: responseForValidCallbackCode,
        });
        stubRequest(gitPaths.getUser, {
            status: 200,
            response: responseForValidAccessToken,
        });

        const req = await getUserDataFromCallback('123');
        expect(req).to.deep.equal({
            ...responseForValidAccessToken,
            accessToken: responseForValidCallbackCode.access_token,
        });
    });
    it('Should call for private email if needed', async () => {
        stubRequest(gitPaths.codeCallback, {
            status: 200,
            response: responseForValidCallbackCode,
        });
        stubRequest(gitPaths.getUser, {
            status: 200,
            response: { ...responseForValidAccessToken, email: undefined },
        });
        stubRequest(gitPaths.getPrivateEmail, {
            status: 200,
            response: [
                {
                    email: 'ex@ex.ex',
                    primary: true,
                },
            ],
        });
        const req = await getUserDataFromCallback('123');
        expect(req).to.contain({ email: 'ex@ex.ex' });
    });
});
