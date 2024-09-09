# rapid-mock

`rapid-mock` is a customizable mock server for Node.js that simplifies defining route handlers. You can easily structure your mock server by directly mapping file paths to URL paths, allowing for efficient and scalable mock API development.

## Features

- Define route handlers without dependency on Express.
- File and directory structure directly correspond to URL paths.
- Hot reload enabled for both development and installed packages.
- Support for HTTPS with certificate options.
- Response delay feature with a set or random range of seconds.
- Support for multiple response definitions per route, with random or conditional selection.
- Logging and rate limiting capabilities for enhanced control.
  - rate limiting is under developing

## Installation

```bash
npm install rapid-mock
```

## How to Use

### 1. Initialize the project

**CAUTION: initializing feature is under developing**

You can initialize a mock server project with:

```bash
npx rapid-mock init
```

This will create the necessary folder structure:

```text
project-root/
├── src/
│ ├── route/
│ │ ├── api/
│ │ │ ├── hello.ts
│ │ │ └── users.ts
│ └── index.ts
└── tsconfig.json
```

### 2. Set up routes

Define your routes inside the `src/route/` folder. For example:

#### `src/route/api/hello.ts`

```typescript
import { createRouteHandlers, HttpStatusCode, Request } from "rapid-mock";

// simple response
const getResponse = {
  status: HttpStatusCode.OK,
  body: { message: "hello" },
};

// with request body
const postResponse = (req: Request) => {
  const { name } = req.body;
  return {
    status: HttpStatusCode.OK,
    body: { message: `hello, ${name}` },
  };
};

export default CreateRouteHandlers({
  get: { response: getResponse },
  post: { response: postResponse },
});
```

#### `src/route/api/users/[user_id]/index.ts`

```typescript
import { createRouteHandlers, HttpStatusCode, Request } from "rapid-mock";

// some data
const userDummyData = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// with route parameter
const getResponse: DummyResponseFactory = (req: Request) => {
  const userId = Number(req.params.user_id);
  const user = userDummyData.find((user) => user.id === userId);

  return {
    status: HttpStatusCode.OK,
    body: { user },
  };
};

export default CreateRouteHandlers({
  get: { response: getResponse },
});
```

#### `src/route/api/counter.ts`

```typescript
import { createRouteHandlers, HttpStatusCode, Request } from "rapid-mock";

// with counter
let counter = 0;

const getResponse: DummyResponseFactory = (_: Request) => {
  return {
    status: HttpStatusCode.OK,
    body: { count: counter++ },
  };
};

export default CreateRouteHandlers({
  get: { response: getResponse },
});
```

### 3. Start the server

Once you've set up your routes, you can start your server:

```bash
npm start
```

This will serve your mock API on `http://localhost:3000`. You can access the `/api/hello` endpoint, for example, to get:

```json
{ "message": "hello" }
```

### 4. HTTPS Support

You can optionally enable HTTPS by providing certificate and key files:

**CAUTION: key and cert path must be written in index.ts. example is under writing**

### 5. Logging, Rate Limiting, and More

You can enable global logging, set response delays, and configure rate limits per route for enhanced functionality.

## Contribution

We welcome contributions! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

### Japanese Version / 日本語版

A Japanese version of this README is available [here](README.ja.md).
