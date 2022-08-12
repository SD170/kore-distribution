import { Request, Response, NextFunction } from 'express';

import ErrorResponse from "../utils/ErrorResponse";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;

    //Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resources not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    //Mongoose duplicate key
    if (err.code === 11000) {
        const keyvals = Object.keys(err.keyValue);
        const message = `Duplicate field value entered: ${keyvals}`;
        error = new ErrorResponse(message, 400);
    }

    //Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((m: any) => m.message);
        error = new ErrorResponse(JSON.stringify(message), 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

export default errorHandler;
