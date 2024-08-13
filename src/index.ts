import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { RouteHandlers } from './types/RouteHandlers';

const app = express();
const port = 3000;

// JSONリクエストボディを解析するためのミドルウェア
app.use(express.json());

const routesDir = path.join(__dirname, 'route');

fs.readdirSync(routesDir).forEach((folder) => {
  const folderPath = path.join(routesDir, folder);

  if (fs.statSync(folderPath).isDirectory()) {
    fs.readdirSync(folderPath).forEach((file) => {
      const routePath = path.join(folderPath, file);
      const handlers: RouteHandlers = require(routePath).default;

      const routeBase = `/${folder}`;

      if (handlers.get) {
        app.get(`${routeBase}/${path.basename(file, '.ts')}`, (req: Request, res: Response) => {
          res.json(handlers.get!(req));
        });
      }

      if (handlers.post) {
        app.post(`${routeBase}/${path.basename(file, '.ts')}`, (req: Request, res: Response) => {
          res.json(handlers.post!(req));
        });
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
