import { Endpoint } from '.';

export interface IConroller {
    [controllers: string]: Endpoint;
}
