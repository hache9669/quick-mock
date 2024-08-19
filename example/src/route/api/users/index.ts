import { Request } from "express";
import { HttpStatusCode, DummyResponseFactory, CreateRouteHandlers } from "rapid-mock";

export const userDummyData = [
    { id: 1, name: 'Alice'},
    { id: 2, name: 'Bob'},
    { id: 3, name: 'Charlie'},
];

const getResponse: DummyResponseFactory = (req: Request) => {
    return {
        status: HttpStatusCode.OK,
        body:{ users: userDummyData } 
    }
};

export default CreateRouteHandlers({
    get: {response: getResponse},
});
