import { Request } from "express";
import { SimpleDummyResponse, HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "rapid-mock";

const getResponse: SimpleDummyResponse = {
  status: HttpStatusCode.OK,
  body: { message: 'hello'}
};

const postResponse: DummyResponseFactory = (req: Request) => {
  const { name } = req.body;
  return {
    status: HttpStatusCode.OK,
    body:{message: `hello, ${name}`} 
  }
};

export default CreateRouteHandlers({
  get: {response: getResponse, options: { delay: 5 }},
  post: {response: postResponse, options: { delay: { max: 10, min: 1 }}}
});
