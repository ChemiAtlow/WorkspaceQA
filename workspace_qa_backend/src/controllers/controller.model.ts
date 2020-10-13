import { Router } from 'express';

export abstract class Controller {
    public abstract readonly path: string;
    public readonly router = Router();
    constructor() {
        this.intializeRoutes();
    }
    protected abstract intializeRoutes(): void;
}
