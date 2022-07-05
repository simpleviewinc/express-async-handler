import express from "express";

import asyncWrap from "./asyncWrap";

const app = express();
app.get("/", asyncWrap<{ foo: string }>(async function(req, res, next) {
	// req.query.foo is required string
}));
