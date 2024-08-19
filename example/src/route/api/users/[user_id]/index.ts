import { Request } from "express";
import { HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "rapid-mock";
import { userDummyData } from "..";

const getResponse: DummyResponseFactory = (req: Request) => {
  const userId = Number(req.params.user_id);
  const user = userDummyData.find(user => user.id === userId);

  return {
    status: HttpStatusCode.OK,
    body:{ user } 
  }
};

export default CreateRouteHandlers({
    get: {response: getResponse},
});
