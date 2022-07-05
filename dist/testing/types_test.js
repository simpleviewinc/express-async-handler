"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expect_type_1 = require("expect-type");
const asyncWrap_1 = __importDefault(require("../asyncWrap"));
const asyncErrWrap_1 = __importDefault(require("../asyncErrWrap"));
const customWrapRequest = (asyncWrap_1.default);
const customWrapBoth = (asyncWrap_1.default);
const customErrWrapBoth = (asyncErrWrap_1.default);
describe(__filename, function () {
    it("should properly type req, res, next", function () {
        const app = (0, express_1.default)();
        app.get("/", function (req, res, next) {
            (0, expect_type_1.expectTypeOf)(req).toMatchTypeOf();
            (0, expect_type_1.expectTypeOf)(req.app).toMatchTypeOf();
            (0, expect_type_1.expectTypeOf)(res).toMatchTypeOf();
            (0, expect_type_1.expectTypeOf)(next).toMatchTypeOf();
        });
        app.get("/async/", (0, asyncWrap_1.default)(async function (req, res, next) {
            (0, expect_type_1.expectTypeOf)(req).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req.app).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req).not.toHaveProperty("session");
            (0, expect_type_1.expectTypeOf)(res).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(next).toEqualTypeOf();
        }));
    });
    it("should properly type with custom Req", function () {
        const app = (0, express_1.default)();
        app.get("/async/", customWrapRequest(async function (req, res, next) {
            (0, expect_type_1.expectTypeOf)(req).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req.app).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req).toHaveProperty("session");
            (0, expect_type_1.expectTypeOf)(req.session).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(res).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(next).toEqualTypeOf();
        }));
    });
    it("should properly type with custom req and res", function () {
        const app = (0, express_1.default)();
        app.get("/async/", customWrapBoth(async function (req, res, next) {
            (0, expect_type_1.expectTypeOf)(req).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req.app).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req).toHaveProperty("session");
            (0, expect_type_1.expectTypeOf)(req.session).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(res).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(res.app).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(next).toEqualTypeOf();
        }));
    });
    it("should work with error handlers", function () {
        const app = (0, express_1.default)();
        app.use((0, asyncErrWrap_1.default)(async function (err, req, res, next) {
            (0, expect_type_1.expectTypeOf)(err).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(res).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(next).toEqualTypeOf();
        }));
    });
    it("should allow ovewriting error handlers", function () {
        const app = (0, express_1.default)();
        app.use(customErrWrapBoth(async function (err, req, res, next) {
            (0, expect_type_1.expectTypeOf)(err).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(req).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(res).toEqualTypeOf();
            (0, expect_type_1.expectTypeOf)(next).toEqualTypeOf();
        }));
    });
});
