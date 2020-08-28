import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): unknown => {
  console.log(err.message);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  } else if (err.name === 'ValidationError') {
    return res.status(401).json({ error: 'There was a validation error' });
  } else if (err.name === 'UnauthorizedError') {
    return res
      .status(403)
      .json({ success: false, message: 'No token provided.' });
  }

  return next(err);
};


