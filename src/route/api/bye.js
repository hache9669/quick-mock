// src/route/api/hello.js
module.exports = {
  get: (req) => {
    return { message: 'bye' };
  },
  post: (req) => {
    const { name } = req.body;
    return { message: `bye, ${name}` };
  },
};
