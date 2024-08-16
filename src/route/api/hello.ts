import { Request } from "express";
import { CreateRouteHandlers } from "../../utils/CreateRouteHandlers";
import HttpStatusCode from "../../utils/HttpStatusCode";
import { DummyResponseFactory, SimpleDummyResponse } from "../../types/DummyResponse";

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
  get: {response: getResponse},
  post: {response: postResponse}
});
