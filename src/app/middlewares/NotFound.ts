import { Request, Response } from 'express';
import  httpStatus  from 'http-status-codes';
export const NotFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
};