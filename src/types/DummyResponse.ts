import { Request } from 'express';
import HttpStatusCode from "../utils/HttpStatusCode";

/**
 * ルートハンドラーが返すレスポンスの実体
 */
export interface SimpleDummyResponse {
    status: HttpStatusCode;
    headers?: { [key:string]: string }; // @TODO 必要か検討して実装
    body?: any
}

/**
 * リクエストに応じて動的にレスポンスを形成する場合はファクトリメソッドを利用する
 */
export type DummyResponseFactory = (request: Request) => SimpleDummyResponse;

/**
 * 複数の候補からランダムにレスポンスを決定する場合に利用する
 * @property content
 * @property possibility 相対的な確率。ex. A:1, B:1, C:2 の場合、AとBが25%・Cが50%
 */
export interface DummyResponsePossibility {
    content: DummyResponse;
    possibility: number;
}

// 利用者に提供する、レスポンス内容の表現方法
export type DummyResponse = SimpleDummyResponse | DummyResponseFactory | DummyResponsePossibility[];

// 複合型を区別するためのユーザー定義型ガード
export const isSimpleDummyResponse = (target: DummyResponse): target is SimpleDummyResponse => {
    const obj = target as any;  // それぞれの型に互換性がないため、一旦anyにする

    return obj.status && Object.values(HttpStatusCode).includes(obj.status)
        && (!obj.headers || checkStringObject(obj.headers))
}

// headers の中身がすべて文字列であることを検証したい
type StringObject = Record<string, string>;
const checkStringObject = (obj: any): obj is StringObject => {
    return typeof obj === 'object'
        && Object.values(obj).every(val => typeof val === 'string');
}

export const isDummyResponseFactory = (target: DummyResponse): target is DummyResponseFactory => {
    return typeof target === 'function';
}

export const isArrayOfDummyResponsePossibility = (target: DummyResponse): target is DummyResponsePossibility[] => {
    return Array.isArray(target)
        && target.every(t => (isSimpleDummyResponse(t.content) || isDummyResponseFactory(t.content)) && typeof t.possibility === 'number');
}