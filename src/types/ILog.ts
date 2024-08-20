import { Request, Response } from "express";

/**
 * ログの出力設定
 */
export type ILog = {
  writeTo: string,
} & Required<LogOption>

/**
 * ログ出力のオプション
 * 
 * @property writeConsole サーバープロセスのコンソールにも出力する場合はtrue
 * @method format 出力文字列を作る関数
 */
export interface LogOption {
  writeConsole?: boolean
  format?: (req: Request, res: Response) => string;
}
