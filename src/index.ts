export { startServer } from "./server";

export { CreateRouteHandlers } from "./utils/CreateRouteHandlers";
export { SimpleDummyResponse, DummyResponseFactory, DummyResponsePossibility, DummyResponse } from "./types/DummyResponse";
import statuses from "./utils/HttpStatusCode";

export { ILog } from "./types/ILog"

export const HttpStatusCode = statuses;