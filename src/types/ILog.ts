import { Request, Response } from "express";

/**
 * ログ出力を定義するインターフェイス
 * 
 * @property writeTo 出力先ファイルパス
 * @property writeConsole? サーバープロセスのコンソールにも出力する場合はtrue
 * @method format 出力文字列を作る関数
 */
export interface ILog {
  writeTo: string;
  writeConsole?: boolean
  format: (req: Request, res: Response) => string;
}