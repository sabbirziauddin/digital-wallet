import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";

type NormalizedError = {
    statusCode: number;
    message: string;
    errors?: Array<{ path?: string; message: string }>;
    stack?: string;
}

const normalizeError = (err: any): NormalizedError => {
// Default values
    let statusCode = 500;
    let message = err?.message || "Internal Server Error";
    let errors: Array<{ path?: string; message: string }> | undefined;

    // AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message || message;
        errors = err.errors;
    }

    // ZodError
    if (err?.name === 'ZodError' && Array.isArray(err.issues)) {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.issues.map((i: any) => ({ path: i.path?.join?.('.') ?? undefined, message: i.message }));
    }

    // Mongoose ValidationError
    if (err?.name === 'ValidationError' && err?.errors) {
        statusCode = 400;
        message = 'Validation failed';
        errors = Object.values(err.errors).map((e: any) => ({ path: e.path, message: e.message }));
    }

    // Mongoose CastError
    if (err?.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongo duplicate key error
    if (err?.code === 11000) {
        statusCode = 409;
        const fields = Object.keys(err.keyValue || {});
        message = `Duplicate value for: ${fields.join(', ')}`;
    }

    // JWT errors
    if (err?.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    if (err?.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    return { statusCode, message, errors, stack: err?.stack };
}

export const globalErrorHandlers = (err: any, req: Request, res: Response, next: NextFunction) => {
    const normalized = normalizeError(err);
    const isDev = envVars.NODE_ENV === 'development';

    res.status(normalized.statusCode).json({
        status: 'error',
        message: normalized.message,
        errors: normalized.errors,
        ...(isDev ? { stack: normalized.stack } : {}),
    });
}