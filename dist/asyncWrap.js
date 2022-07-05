"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncWrap(fn) {
    return function (req, res, next) {
        const fnPromise = fn(req, res, next);
        return Promise.resolve(fnPromise).catch(next);
    };
}
exports.default = asyncWrap;
