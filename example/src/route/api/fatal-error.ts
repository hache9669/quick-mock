import { Request } from "express";
import { SimpleDummyResponse, HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "rapid-mock";

const getResponse: SimpleDummyResponse = {
  status: HttpStatusCode.OK,
  body: { message: 'get will works good'}
};

const postResponse: DummyResponseFactory = (req: Request) => {
  throw new Error('post throws critical error');
};

export default CreateRouteHandlers({
  get: {response: getResponse},
  post: {response: postResponse}
});
