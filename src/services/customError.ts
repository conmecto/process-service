export default class CustomError extends Error {
    private status: number;
    private error: string;
    private errorCode: string;
    private path?: string;
    
    constructor(status: number, error: string, errorCode: string) {
        super();
        this.status = status;
        this.error = error;
        this.errorCode = errorCode;
    }

    get errorStatus() {
        return this.status;
    }

    get errorObject() {
        return {
            status: this.status,
            error: this.error,
            errorCode: this.errorCode,
            path: this.path
        }
    }

    set apiPath(path: string) {
        this.path = path;
    }
}