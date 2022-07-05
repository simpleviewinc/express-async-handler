# @simpleview/express-async-handler

Wrap an express handler to properly handle async errors. Same as `npm express-async-handler` but with better typing.

# Installation

```
npm install @simpleview/express-async-handler
```

# Use

### Basic Example

```typescript
import express from "express";
import { asyncWrap } from "@simpleview/express-async-handler";

const app = express();
app.get("/", asyncWrap(async function(req, res, next) {
    // any errors thrown will be passed on to next() automatically
});
```

### With custom typing

In order to get rich typing you'll want to setup some helper types. There are two primary needs for custom typing.

* Customization of the Application locals (`req.app.locals`, `res.app.locals`).
* Customization of the Request (`req.query`, `req.body`, `req.session`).

There is a full example in [examples/custom_typing](examples/custom_typing).
