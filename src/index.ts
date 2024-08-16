import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { resolveRoute, RouteDefine, RouteHandlers } from './types/RouteHandlers';
import picocolors from 'picocolors';

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

/**
 * ディレクトリを指定し、ルートハンドラーを登録する
 * @param parent 
 */
const seek = (parentPath: string, rootPath?: string) => {
  if(!rootPath) {
    rootPath = parentPath;
  }

  fs.readdirSync(parentPath).forEach(childName => {
    const childPath = path.join(parentPath, childName);

    if(fs.statSync(childPath).isDirectory()) {
      // ディレクトリなら再帰的に探索
      seek(childPath, rootPath);
    } else {
      // ファイルなら内容を読み取り、ルートとして定義
      load(childPath, rootPath);
    }
  });
};

const load = (filePath: string, rootPath: string) => {
  const handlers: RouteHandlers = require(filePath).default;

  const fileParentPath = path.dirname(filePath);
  const relativePart = path.relative(rootPath, fileParentPath).split(path.sep).join('/');
  const url = `/${relativePart}/${path.basename(filePath, '.ts')}`

  console.log(picocolors.bold(url));
  console.log('  ' + Object.keys(handlers).map(method => method.toUpperCase()).join(', '))

  if (handlers.get) createResponse(handlers.get, 'get', url);
  if (handlers.post) createResponse(handlers.post, 'post', url);
  if (handlers.put) createResponse(handlers.put, 'put', url);
  if (handlers.delete) createResponse(handlers.delete, 'delete', url);
}

const routesDir = path.join(__dirname, 'route');
seek(routesDir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
