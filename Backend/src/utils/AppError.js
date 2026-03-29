//custom error class to handle errors in the application

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true; //to distinguish between operational errors and programming errors
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;