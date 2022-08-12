"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    //Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resources not found with id of ${err.value}`;
        error = new ErrorResponse_1.default(message, 404);
    }
    //Mongoose duplicate key
    if (err.code === 11000) {
        const keyvals = Object.keys(err.keyValue);
        const message = `Duplicate field value entered: ${keyvals}`;
        error = new ErrorResponse_1.default(message, 400);
    }
    //Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((m) => m.message);
        error = new ErrorResponse_1.default(JSON.stringify(message), 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};
exports.default = errorHandler;
