import { CreateRouteHandlers } from "../../utils/CreateRouteHandlers";

export default CreateRouteHandlers({
  get: (req) => {
    return { message: 'bye' };
  },
  post: (req) => {
    const { name } = req.body;
    return { message: `bye, ${name}` };
  },
});
