import { Request } from 'express';

export interface RouteHandlers {
  get?: (req: Request) => any;
  post?: (req: Request) => any;
}
