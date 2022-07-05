import { NextFunction, RequestHandler, Request, Response } from "express";
import { request, RequestListener } from "http";

// interface RequestHandler<
//         P = core.ParamsDictionary,
//         ResBody = any,
//         ReqBody = any,
//         ReqQuery = core.Query,
//         Locals extends Record<string, any> = Record<string, any>
//     > extends core.RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {}

// export type AsyncRequestHandler<
//     P = unknown,
//     ResBody = unknown,
//     ReqBody = unknown,
//     ReqQuery = unknown,
//     Locals = unknown
// > = (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => Promise<void>

// export type AsyncRequestHandler<Fn = RequestHandler> = Fn extends (...args: infer A) => any ? (...args: A) => Promise<void> :  never;

// export type AsyncRequestHandler = (...args: Parameters<RequestHandler>) => Promise<void>;

export type AsyncRequestHandler<R1 = Request, R2 = Response> = (req: R1, res: R2, next: NextFunction) => Promise<void>;
export type AsyncErrHandler<R1 = Request, R2 = Response> = (err: Error, req: R1, res: R2, next: NextFunction) => Promise<void>;


// Request, Response, Application
