import { Request, Response } from "express";
import { AsyncRequestHandler } from "./types";
export default function asyncWrap<RequestBase = Request, ResponseBase = Response>(fn: AsyncRequestHandler<RequestBase, ResponseBase>): (req: any, res: any, next: any) => Promise<void>;
