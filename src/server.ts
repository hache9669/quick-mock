import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { isRouteHandlers, resolveRoute, RouteDefine, RouteHandlers } from './types/RouteHandlers';
import picocolors from 'picocolors';
import { rabbitSays } from './utils/logs';

export const startServer = (routesDir: string, port: number) => {
  // expressの初期化
  const app = express();

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
    if(!isRouteHandlers(handlers)) {
      console.log(picocolors.red(filePath + ' is not route handler.'));
      console.log(picocolors.red('export default = ' + handlers));
      return;
    }

    const fileParentPath = path.dirname(filePath);
    const relativePart = path.relative(rootPath, fileParentPath).split(path.sep).join('/');
    const url = `/${relativePart}/${path.basename(filePath, '.ts')}`.replace('//', '/');

    console.log(picocolors.bold(url));
    console.log('  ' + Object.keys(handlers).map(method => method.toUpperCase()).join(', '))

    if (handlers.get) createResponse(handlers.get, 'get', url);
    if (handlers.post) createResponse(handlers.post, 'post', url);
    if (handlers.put) createResponse(handlers.put, 'put', url);
    if (handlers.delete) createResponse(handlers.delete, 'delete', url);
  }

  rabbitSays('finding route definition...');

  // 指定されたディレクトリ内部のルート定義ファイルからAPIのルートを登録
  seek(routesDir);

  // サーバー起動
  app.listen(port, () => {
    const message = `Server is running on http://localhost:${port}`;
    rabbitSays(message, true);
  });
}
