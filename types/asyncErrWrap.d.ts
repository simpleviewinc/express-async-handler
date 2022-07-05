import { Request, Response } from "express";
import { AsyncErrHandler } from "./types";
export default function asyncErrWrap<RequestBase = Request, ResponseBase = Response>(fn: AsyncErrHandler<RequestBase, ResponseBase>): (err: any, req: any, res: any, next: any) => Promise<void>;
