import { Request } from 'express';
import { DummyResponse, isArrayOfDummyResponsePossibility, isDummyResponseFactory, isSimpleDummyResponse, SimpleDummyResponse } from './DummyResponse';

export interface RouteHandlers {
  get?: RouteDefine;
  post?: RouteDefine;
  put?: RouteDefine;
  delete?: RouteDefine;
}

/**
 * ルート定義
 * 
 * @property response レスポンス内容
 * @property options ルートごとに設定されるオプション
 */
export interface RouteDefine {
  response: DummyResponse;
  options?: RouteOption
}

/**
 * ルート定義オブジェクトからレスポンスを作成する
 * 
 * @param app expressのインスタンス。オプションの指定によってはミドルウェアが追加される可能性あり
 * @param def ルート定義
 * @param req リクエスト
 * @returns レスポンス情報
 */
export const resolveRoute = (app: Express.Application, def: RouteDefine, req: Request): SimpleDummyResponse => {
  // 単にオブジェクトで固定値が定義されている場合は、そのものを返す
  if(isSimpleDummyResponse(def.response)) {
    return def.response;
  }
  
  // リクエストに応じて動的に決定する場合はファクトリメソッドを通す
  if(isDummyResponseFactory(def.response)) {
    return def.response(req);
  }
  
  // 候補の中からランダムにレスポンスする場合
  if(isArrayOfDummyResponsePossibility(def.response)) {
    // 相対確率に従って要素を選択
    const possibleResponses = def.response.map(content => ({p: content.possibility, self: content}));
    const selected = selectRandom(possibleResponses);

    // 選択した要素を再帰的に解決
    return resolveRoute(
      app,
      {
        response: selected.content,
        options: def.options
      },
      req
    );
  }

  throw new Error('resolveRoute: do not reach here');
}

const selectRandom = <T>(items: Array<{p: number, self: T}>): T => {
  // 相対確率の合計値を求める
  const totalP = items.reduce((total, item) => total + item.p, 0);

  // 0 ~ total 間のどこを選択するか、乱数で決定
  let random = Math.random() * totalP;

  // 配列の先頭から、乱数が示す要素を選択
  items.forEach(item => {
    if (random < item.p) {
      return item.self;
    }
    random -= item.p;
  });

  throw new Error('selectRandom: do not reach here');
}

/**
 * ルート定義のオプション
 * 
 * @property delay 遅延させる場合に指定する。範囲を指定した場合、その範囲内でランダムに遅延する
 */
interface RouteOption {
  delay?: number | Range
}

interface Range {
  min: number;
  max: number;
}
