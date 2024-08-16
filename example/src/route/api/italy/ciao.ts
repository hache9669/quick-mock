import { Request } from "express";
import { SimpleDummyResponse, HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "quick-mock";

const getResponse: SimpleDummyResponse = {
  status: HttpStatusCode.OK,
  body: { message: 'ciao'}
};

const postResponse: DummyResponseFactory = (req: Request) => {
  const { name } = req.body;
  return {
    status: HttpStatusCode.OK,
    body:{message: `ciao, ${name}`} 
  }
};

export default CreateRouteHandlers({
  get: {response: getResponse},
  post: {response: postResponse}
});
