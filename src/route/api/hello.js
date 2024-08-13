// src/route/api/hello.js
module.exports = {
    get: (req) => {
      return { message: 'hello' };
    },
    post: (req) => {
      const { name } = req.body;
      return { message: `hello, ${name}` };
    },
  };
  