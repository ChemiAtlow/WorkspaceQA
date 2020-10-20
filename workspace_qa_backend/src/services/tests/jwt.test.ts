import { expect } from 'chai';
import { HttpException } from '../../exceptions';
import { userModel } from '../../models/DB/schemas';
import { createJWTToken, isValidJWTToken } from '../../services/jwt.service';

describe('Test JWT service', () => {
    const tmpUser = new userModel();
    let token: string;
    it('Should throw since user object is lacking ID', async () => {
        const id = tmpUser._id;
        tmpUser._id = null;
        expect(tmpUser._id).to.to.null;
        expect(() => createJWTToken(tmpUser)).to.throw(HttpException);
        tmpUser._id = id;
    });
    it('Should create a token', () => {
        token = createJWTToken(tmpUser);
        const JWS_REGEX = /^Authorization=jwt [a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?; Max-Age=18000000$/;
        expect(token).to.match(JWS_REGEX);
    });
    it('Should return false for invalid token', () => {
        expect(isValidJWTToken('')).to.be.false;
    });
    it('Should return true for valid token', () => {
        const tokenStripped = token.match(
            /[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?/g
        );
        expect(tokenStripped).to.be.an('array').that.is.not.empty;
        expect(tokenStripped?.length).to.equal(1);
        expect(isValidJWTToken(`${tokenStripped?.[0]}`)).to.be.true;
    });
});
