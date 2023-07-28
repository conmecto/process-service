import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
//import { ValidationError, } from 'joi';
import { CustomError } from '../services';
import { enums } from '../utils';

export const errorHandler: ErrorRequestHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error handler', err);
    let newError: CustomError;
    if (err instanceof CustomError) {
        newError = err;
    // } else if (err instanceof ValidationError) {
    //     newError = new CustomError(enums.StatusCodes.BAD_REQUEST, err.message, enums.ErrorCodes.VALIDATION_ERROR);
    } else {
        newError = new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    newError.apiPath = req.originalUrl;
    res.status(newError.errorStatus).send(newError.errorObject);
}