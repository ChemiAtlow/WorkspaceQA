import { expect } from 'chai';
import { config } from 'dotenv';

describe('test env', () => {
    config();
    it('should have a port', () => {
        expect(process.env.PORT).to.exist;
    });
    it('should have a JWT scheme', () => {
        expect(process.env.JWT_SCHEME).to.exist;
    });
    it('should have a JWT secret', () => {
        expect(process.env.JWT_SECRET_OR_KEY).to.exist;
    });
    it('should have a JWT expiration number', () => {
        expect(process.env.JWT_TOKEN_EXPIRATION).to.exist.and.match(/[0-9]+/);
    });
    it('should have a Github Client ID', () => {
        expect(process.env.GITHUB_APP_CLIENT_ID).to.exist;
    });
    it('should have a Github Client Secret', () => {
        expect(process.env.GITHUB_APP_CLIENT_SECRET).to.exist;
    });
    it('should have a Mongo user', () => {
        expect(process.env.MONGO_USER).to.exist;
    });
    it('should have a Mongo pass', () => {
        expect(process.env.MONGO_PASS).to.exist;
    });
    it('should have a Mongo path', () => {
        expect(process.env.MONGO_PATH).to.exist.and.match(
            /^@[a-zA-Z.-]+\.mongodb.net\/[a-zA-Z?=&]+$/
        );
    });
});
