import { config as dotenvConfig } from 'dotenv';
import { App } from './app';

dotenvConfig();

const port = parseInt(process.env.PORT ?? '3000');

const app = new App([], port);

app.listen();
