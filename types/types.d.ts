import { NextFunction, Request, Response } from "express";
export declare type AsyncRequestHandler<R1 = Request, R2 = Response> = (req: R1, res: R2, next: NextFunction) => Promise<void>;
export declare type AsyncErrHandler<R1 = Request, R2 = Response> = (err: Error, req: R1, res: R2, next: NextFunction) => Promise<void>;
