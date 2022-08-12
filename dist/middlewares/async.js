"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// we don't want asyncHandler to resolve/run the controllers, we want express to do it
// so asyncHandler is a higher order function returning an anonymous function.
function asyncHandler(fn) {
    return function (req, res, next) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
}
;
exports.default = asyncHandler;
