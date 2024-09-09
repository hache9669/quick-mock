import { Request } from "express";
import { HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "rapid-mock";

let counter = 0;

const getResponse: DummyResponseFactory = (_: Request) => {
  return {
    status: HttpStatusCode.OK,
    body:{ count: counter++ } 
  }
};

export default CreateRouteHandlers({
  get: {response: getResponse},
});
