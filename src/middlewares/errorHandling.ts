import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { CustomError, logger } from '../services';
import { enums } from '../utils';

export const errorHandler: ErrorRequestHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    let newError: CustomError;
    if (error instanceof CustomError) {
        newError = error;
        const errorObj = error.loggingErrorObject;
        await logger('Process Service: Error handler: ' + JSON.stringify(errorObj));
    } else {
        await logger('Process Service: Error handler: ' + JSON.stringify({
            message: error?.toString(),
            stack: error?.stack 
        }));
        newError = new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    newError.apiPath = req.originalUrl;
    res.status(newError.errorStatus).send(newError.errorObject);
}