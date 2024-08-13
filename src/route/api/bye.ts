import { Request } from "express";
import { RouteHandlers } from "../../types/RouteHandlers";

const helloHandlers: RouteHandlers = {
  get: (req: Request) => {
    return { message: 'bye' };
  },
  post: (req: Request) => {
    const { name } = req.body;
    return { message: `bye, ${name}` };
  },
};

export default helloHandlers;