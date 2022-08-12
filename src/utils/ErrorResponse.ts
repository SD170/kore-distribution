import { Error } from 'mongoose';

// custom error
class ErrorResponse extends Error {
    // fields
    statusCode: number | undefined;

    constructor(errorMessage: string, statusCode?: number | undefined) {
        super(errorMessage);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;