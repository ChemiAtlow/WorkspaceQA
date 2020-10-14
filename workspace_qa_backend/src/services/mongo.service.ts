import { connect } from 'mongoose';
import { appLogger } from './appLogger.service';

export const mongoDBConnect = async () => {
    const { MONGO_USER, MONGO_PASS, MONGO_PATH } = process.env;
    try {
        await connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}${MONGO_PATH}`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        appLogger.debug('Connected to mongo!!!');
    } catch (error) {
        appLogger.error('Could not connect to MongoDB', error);
    }
};
