import express from "express";
import supertest from "supertest";
import { execSync } from "child_process";
import { strictEqual, deepStrictEqual } from "assert";
import { promisify } from "util";
import { spy } from "sinon";

import asyncWrap from "../asyncWrap";
import asyncErrWrap from "../asyncErrWrap";

const setTimeoutP = promisify(setTimeout);

function defaultErrorHandler(err, req, res, next) {
	res.status(500).json({ message: err.message });
}

describe(__filename, function() {
	it("should handle sync error", async function() {
		const app = express();
		app.get("/", asyncWrap(async function(req, res) {
			throw new Error("dead");
		}));
		app.use(defaultErrorHandler);

		const result = await supertest(app).get("/");

		deepStrictEqual(result.body, { message: "dead" });
	});

	it("should handle async error", async function() {
		async function doSomething() {
			await setTimeoutP(1);
			throw new Error("Async Error");
		}

		const app = express();
		app.get("/", asyncWrap(async function(req, res) {
			await doSomething();
		}));
		app.use(defaultErrorHandler);

		const result = await supertest(app).get("/");

		deepStrictEqual(result.body, { message: "Async Error" });
	});

	it("should not interfere with downstream error handling", async function() {
		const app = express();
		const handler = spy(async function(req, res, next) {
			return next();
		});
		app.use(asyncWrap(handler));

		app.get("/", asyncWrap(async function(req, res, next) {
			throw new Error("Second Route");
		}));
		app.use(defaultErrorHandler);

		const result = await supertest(app).get("/");

		deepStrictEqual(result.body, { message: "Second Route" });
		strictEqual(handler.callCount, 1);
	});

	it("should wrap error handlers", async function() {
		const app = express();
		const finalHandler = spy(function(err, req, res, next) {
			return res.status(500).json({ message: err.message });
		});

		app.get("/", function(req, res, next) {
			throw new Error("test");
		});
		app.use(asyncErrWrap(async function(err, req, res, next) {
			throw new Error(`${err.message} - in handler`);
		}));

		app.use(finalHandler);

		const result = await supertest(app).get("/");

		deepStrictEqual(result.body, { message: "test - in handler" });
		strictEqual(finalHandler.callCount, 1);
	});

	it("should have valid types", function() {
		this.timeout(5000);

		execSync("npm run test:types", { stdio: "inherit" });
	});
});
