import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { userModel } from '../models/DB/schemas';

// config passport
export function passportConfig() {
    // define passport jwt strategy
    const opts: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(process.env.JWT_SCHEME || 'jwt'),
        secretOrKey: process.env.JWT_SECRET_OR_KEY,
    };

    const passportJWTStrategy = new Strategy(opts, function (jwtPayload, done) {
        const _id = jwtPayload._id;
        userModel.findById(_id, (err, user) => done(err || null, user || false));
    });
    // token strategy
    passport.use(passportJWTStrategy);
    // return configured passport
    return passport;
}
