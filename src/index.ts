import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { resolveRoute, RouteDefine, RouteHandlers } from './types/RouteHandlers';

// expressの初期化
const app = express();
const port = 3000;

// ミドルウェア登録
app.use(express.json());

/**
 * ルート定義オブジェクトからレスポンスを作成する処理
 * 
 * @param route ルート定義オブジェクト
 * @param expressMethod HTTPメソッド（Express）
 * @param url ファイル名・ディレクトリから作成したURL
 */
const createResponse = (route: RouteDefine, expressMethod: "get" | "post" | "put" | "delete", url: string) => {
  app[expressMethod](url, (req: Request, res: Response) => {
    const { status, headers, body } = resolveRoute(app, route, req);
    res.status(status).header(headers).json(body);
  });
}

const routesDir = path.join(__dirname, 'route');

fs.readdirSync(routesDir).forEach((folder) => {
  const folderPath = path.join(routesDir, folder);

  if (fs.statSync(folderPath).isDirectory()) {
    fs.readdirSync(folderPath).forEach((file) => {
      const routePath = path.join(folderPath, file);
      const handlers: RouteHandlers = require(routePath).default;

      const routeBase = `/${folder}`;
      const url = `${routeBase}/${path.basename(file, '.ts')}`;

      if (handlers.get) createResponse(handlers.get, 'get', url);
      if (handlers.post) createResponse(handlers.post, 'post', url);
      if (handlers.put) createResponse(handlers.put, 'put', url);
      if (handlers.delete) createResponse(handlers.delete, 'delete', url);
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
