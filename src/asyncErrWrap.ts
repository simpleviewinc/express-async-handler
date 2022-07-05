import { Request, Response } from "express";

import { AsyncErrHandler } from "./types";

export default function asyncErrWrap<RequestBase = Request, ResponseBase = Response>(fn: AsyncErrHandler<RequestBase, ResponseBase>) {
	return function(err, req, res, next) {
		const fnPromise = fn(err, req, res, next);
		return Promise.resolve(fnPromise).catch(next);
	}
}
