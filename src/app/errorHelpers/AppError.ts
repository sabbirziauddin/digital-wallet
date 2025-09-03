class AppError extends Error {
    public statusCode: number;
    public errors?: Array<{ path?: string; message: string }>
    public isOperational: boolean;
    constructor(statusCode: number, message: string, errors?: Array<{ path?: string; message: string }>, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;