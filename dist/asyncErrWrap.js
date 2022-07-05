"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncErrWrap(fn) {
    return function (err, req, res, next) {
        const fnPromise = fn(err, req, res, next);
        return Promise.resolve(fnPromise).catch(next);
    };
}
exports.default = asyncErrWrap;
