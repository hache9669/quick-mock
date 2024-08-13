import { CreateRouteHandlers } from "../../utils/CreateRouteHandlers";

export default CreateRouteHandlers({
  get: (req) => {
    return { message: 'hello' };
  },
  post: (req) => {
    const { name } = req.body;
    return { message: `hello, ${name}` };
  },
});
