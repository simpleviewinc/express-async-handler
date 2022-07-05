"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const child_process_1 = require("child_process");
const assert_1 = require("assert");
const util_1 = require("util");
const sinon_1 = require("sinon");
const asyncWrap_1 = __importDefault(require("../asyncWrap"));
const asyncErrWrap_1 = __importDefault(require("../asyncErrWrap"));
const setTimeoutP = (0, util_1.promisify)(setTimeout);
function defaultErrorHandler(err, req, res, next) {
    res.status(500).json({ message: err.message });
}
describe(__filename, function () {
    it("should handle sync error", async function () {
        const app = (0, express_1.default)();
        app.get("/", (0, asyncWrap_1.default)(async function (req, res) {
            throw new Error("dead");
        }));
        app.use(defaultErrorHandler);
        const result = await (0, supertest_1.default)(app).get("/");
        (0, assert_1.deepStrictEqual)(result.body, { message: "dead" });
    });
    it("should handle async error", async function () {
        async function doSomething() {
            await setTimeoutP(1);
            throw new Error("Async Error");
        }
        const app = (0, express_1.default)();
        app.get("/", (0, asyncWrap_1.default)(async function (req, res) {
            await doSomething();
        }));
        app.use(defaultErrorHandler);
        const result = await (0, supertest_1.default)(app).get("/");
        (0, assert_1.deepStrictEqual)(result.body, { message: "Async Error" });
    });
    it("should not interfere with downstream error handling", async function () {
        const app = (0, express_1.default)();
        const handler = (0, sinon_1.spy)(async function (req, res, next) {
            return next();
        });
        app.use((0, asyncWrap_1.default)(handler));
        app.get("/", (0, asyncWrap_1.default)(async function (req, res, next) {
            throw new Error("Second Route");
        }));
        app.use(defaultErrorHandler);
        const result = await (0, supertest_1.default)(app).get("/");
        (0, assert_1.deepStrictEqual)(result.body, { message: "Second Route" });
        (0, assert_1.strictEqual)(handler.callCount, 1);
    });
    it("should wrap error handlers", async function () {
        const app = (0, express_1.default)();
        const finalHandler = (0, sinon_1.spy)(function (err, req, res, next) {
            return res.status(500).json({ message: err.message });
        });
        app.get("/", function (req, res, next) {
            throw new Error("test");
        });
        app.use((0, asyncErrWrap_1.default)(async function (err, req, res, next) {
            throw new Error(`${err.message} - in handler`);
        }));
        app.use(finalHandler);
        const result = await (0, supertest_1.default)(app).get("/");
        (0, assert_1.deepStrictEqual)(result.body, { message: "test - in handler" });
        (0, assert_1.strictEqual)(finalHandler.callCount, 1);
    });
    it("should have valid types", function () {
        this.timeout(5000);
        (0, child_process_1.execSync)("npm run test:types", { stdio: "inherit" });
    });
});
