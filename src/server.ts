import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { isRouteHandlers, resolveRoute, RouteDefine, RouteHandlers } from './types/RouteHandlers';
import picocolors from 'picocolors';
import { rabbitSays } from './utils/logutils';
import { ILog } from './types/ILog';
import { createDefaultLogger, createLogMiddleware } from './middleware/logger';

/**
 * ディレクトリ構造から、APIのURLを組み立てる
 * 
 * @param rootPath 
 * @param filePath 
 * @returns 
 */
const createUrl = (rootPath: string, filePath: string) => {
  const fileParentPath = path.dirname(filePath);
  const relativePart = path.relative(rootPath, fileParentPath).split(path.sep).join('/');
  
  const filename = path.basename(filePath, '.ts');
  let url = `/${relativePart}`;
  
  // 各ディレクトリのindex.ts はディレクトリ名でアクセスできる
  // ex. route/api/locale/index.ts  --> /api/locale
  //     route/api/locale/ja-JP.ts  --> /api/locale/ja-JP
  if(filename !== 'index') url += '/' + filename;

  // [name]はパスパラメータになる
  // ex. route/api/users/[userId].ts         --> /api/users/1
  //     route/api/posts/[postId]/publish.ts --> /api/posts/1/publish
  url = url.replace(/\[(.+)\]/, ':$1');
  
  return url.replace('//', '/');
}

/**
 * 
 * @param routesDir ルート定義を格納しているディレクトリのパス
 * @param port サーバを動かすポート
 * @param logging ログファイルのパス、もしくはログの設定オブジェクト
 */
export const startServer = (routesDir: string, port: number, logging?: ILog|string) => {
  // expressの初期化
  const app = express();
  app.use(express.json());

  /** @ts-ignore エラーハンドリング */
  app.use((err, req, res, next) => {
    console.error(err.stack);
    // @TODO レスポンスどうすべき？
  });

  // ログの設定
  if(logging) {
    let logger: ILog = (typeof logging === 'string') ? createDefaultLogger(logging) : logging;
    const logMiddleware = createLogMiddleware(logger);
    app.use(logMiddleware);
  }

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

  /**
   * ファイルを読み込み、ルートの定義であれば登録する
   * 
   * @param filePath 読み込むファイルのパス
   * @param rootPath ルート定義が格納されるディレクトリの最上位パス
   */
  const load = (filePath: string, rootPath: string) => {
    if (path.extname(filePath) !== '.ts') {
      console.log(picocolors.red(filePath + ' is not typescript file.'));
      return;
    }

    const handlers: RouteHandlers = require(filePath).default;
    if(!isRouteHandlers(handlers)) {
      console.log(picocolors.red(filePath + ' is not route handler.'));
      console.log(picocolors.red('export default = ' + handlers));
      return;
    }

    const url = createUrl(rootPath, filePath);
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
