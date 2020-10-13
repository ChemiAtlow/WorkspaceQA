import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import { HttpException } from './exceptions/HttpException';
import { errorMiddleware } from './middleware/error.middleware';

dotenvConfig();

const port = process.env.PORT ?? 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use('*', errorMiddleware);

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
