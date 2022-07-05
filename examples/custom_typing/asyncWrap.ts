import { Request, Application } from "express";
import { asyncWrap as baseWrap, AsyncRequestHandler } from "@simpleview/express-async-handler";

// Declare our custom application locals
type MyApplication = Application & {
	locals: {
		foo: string
		bar: boolean
	}
}

// Declare our session variables
type MySession = {
	user?: {
		first: string
		last: string
	},
	token?: string
}

// Declare a generic to allow overwriting of the query on a route-by-route basis
type MyRequest<Query> = Omit<Request, "query"> & {
	app: MyApplication
	session?: MySession
	query: Query
}

type MyResponse = Response & {
	app: MyApplication
}

// This function definition means that we can declare the req.query on a route-by-route basis
// This could be expanded to support declaring body as well
// We import this function throughout our application so that all routes are properly typed
export default function asyncWrap<T = Request["query"]>(fn: AsyncRequestHandler<MyRequest<T>, MyResponse>) {
	return baseWrap(fn);
}
