import { Request, Response, NextFunction } from 'express';
// we don't want asyncHandler to resolve/run the controllers, we want express to do it
// so asyncHandler is a higher order function returning an anonymous function.
function asyncHandler(fn: Function) {
    return function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;