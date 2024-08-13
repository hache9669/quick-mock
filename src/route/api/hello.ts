import { Request } from "express";
import { RouteHandlers } from "../../types/RouteHandlers";

const helloHandlers: RouteHandlers = {
  get: (req: Request) => {
    return { message: 'hello!' };
  },
  post: (req: Request) => {
    const { name } = req.body;
    return { message: `hello, ${name}` };
  },
};

export default helloHandlers;