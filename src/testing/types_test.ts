import express, { Request, Response, NextFunction, RequestHandler, Application } from "express";
import { expectTypeOf } from "expect-type";

import asyncWrap from "../asyncWrap";
import asyncErrWrap from "../asyncErrWrap";
import { AsyncRequestHandler } from "../types";

type CustomLocals = {
	foo?: string
}

type MyApp = Application & {
	locals: CustomLocals
}

type MySession = {
	user: {
		first: string
		last: string
	}
	token: string
}

type RequestBase = Request & {
	app: MyApp
	session?: MySession
}

type ResponseBase = Response & {
	app: MyApp
	custom?: boolean
}

type RequestBaseWithQuery<Query> = Omit<Request, "query"> & {
	app: MyApp
	query: Query
}


const customWrapRequest = asyncWrap<RequestBase>;
const customWrapBoth = asyncWrap<RequestBase, ResponseBase>;
const customErrWrapBoth = asyncErrWrap<RequestBase, ResponseBase>;
function customWrapWithQuery<T = Request["query"]>(fn: AsyncRequestHandler<RequestBaseWithQuery<T>, Response>) {
	return asyncWrap(fn);
}

describe(__filename, function() {
	it("should properly type req, res, next", function() {
		const app = express();

		app.get("/", function(req, res, next) {
			expectTypeOf(req).toMatchTypeOf<Request>()
			expectTypeOf(req.app).toMatchTypeOf<Record<string, any>>();
			expectTypeOf(res).toMatchTypeOf<Response>()
			expectTypeOf(next).toMatchTypeOf<NextFunction>()

		});

		app.get("/async/", asyncWrap(async function (req, res, next) {
			expectTypeOf(req).toEqualTypeOf<Request>();
			expectTypeOf(req.app).toEqualTypeOf<Application>();
			expectTypeOf(req).not.toHaveProperty("session");
			expectTypeOf(res).toEqualTypeOf<Response>();
			expectTypeOf(next).toEqualTypeOf<NextFunction>();
		}));
	});

	it("should properly type with custom Req", function() {
		const app = express();

		app.get("/async/", customWrapRequest(async function(req, res, next) {
			expectTypeOf(req).toEqualTypeOf<RequestBase>();
			expectTypeOf(req.app).toEqualTypeOf<MyApp>();
			expectTypeOf(req).toHaveProperty("session");
			expectTypeOf(req.session).toEqualTypeOf<MySession | undefined>();
			expectTypeOf(res).toEqualTypeOf<Response>();
			expectTypeOf(next).toEqualTypeOf<NextFunction>();
		}));
	});

	it("should properly type with custom req and res", function() {
		const app = express();

		app.get("/async/", customWrapBoth(async function(req, res, next) {
			expectTypeOf(req).toEqualTypeOf<RequestBase>();
			expectTypeOf(req.app).toEqualTypeOf<MyApp>();
			expectTypeOf(req).toHaveProperty("session");
			expectTypeOf(req.session).toEqualTypeOf<MySession | undefined>();
			expectTypeOf(res).toEqualTypeOf<ResponseBase>();
			expectTypeOf(res.app).toEqualTypeOf<MyApp>();
			expectTypeOf(next).toEqualTypeOf<NextFunction>();
		}));
	});

	it("should work with query overwritten at runtime", function() {
		const app = express();

		app.get("/async/", customWrapWithQuery<{ foo: string }>(async function(req, res, next) {
			expectTypeOf(req).toEqualTypeOf<RequestBaseWithQuery<{ foo: string }>>();
			expectTypeOf(req.query).toEqualTypeOf<{ foo: string }>();
			expectTypeOf(res).toEqualTypeOf<Response>();
			expectTypeOf(next).toEqualTypeOf<NextFunction>();
		}));
	});

	it("should work with error handlers", function() {
		const app = express();

		app.use(asyncErrWrap(async function(err, req, res, next) {
			expectTypeOf(err).toEqualTypeOf<Error>();
			expectTypeOf(req).toEqualTypeOf<Request>();
			expectTypeOf(res).toEqualTypeOf<Response>();
			expectTypeOf(next).toEqualTypeOf<NextFunction>();
		}));
	});

	it("should allow ovewriting error handlers", function() {
		const app = express();

		app.use(customErrWrapBoth(async function(err, req, res, next) {
			expectTypeOf(err).toEqualTypeOf<Error>();
			expectTypeOf(req).toEqualTypeOf<RequestBase>();
			expectTypeOf(res).toEqualTypeOf<ResponseBase>();
			expectTypeOf(next).toEqualTypeOf<NextFunction>();
		}));
	});
});
