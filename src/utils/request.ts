import { Request } from 'express';
import { IRequestObject } from './interfaces';

const filterRequest = async (req: Request): Promise<IRequestObject> => {
    const httpRequest: IRequestObject = {
        body: req.body,
        path: req.path,
        params: req.params,
        query: req.query,
        method: req.method,
        headers: req.headers
    };
    return httpRequest;
}

export { filterRequest };
