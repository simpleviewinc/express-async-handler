import { Request, Response } from "express";

import { AsyncRequestHandler } from "./types";

export default function asyncWrap<RequestBase = Request, ResponseBase = Response>(fn: AsyncRequestHandler<RequestBase, ResponseBase>) {
	return function(req, res, next) {
		const fnPromise = fn(req, res, next);
		return Promise.resolve(fnPromise).catch(next);
	}
}

