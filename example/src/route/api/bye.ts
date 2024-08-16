import { Request } from "express";
import { SimpleDummyResponse, HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "quick-mock";

const getResponse: SimpleDummyResponse = {
  status: HttpStatusCode.OK,
  body: { message: 'bye'}
};

const postResponse: DummyResponseFactory = (req: Request) => {
  const { name } = req.body;
  return {
    status: HttpStatusCode.I_AM_A_TEAPOT,
    headers: {
      'my-custom-header': 'some header value'
    },
    body:{message: `bye, ${name}`} 
  }
};

export default CreateRouteHandlers({
  get: {response: getResponse},
  post: {response: postResponse}
});
