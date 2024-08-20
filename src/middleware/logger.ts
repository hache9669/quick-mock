import fs from 'fs';
import os from 'os';
import { ILog } from "../types/ILog";
import { NextFunction, Request, Response } from "express";

export const createDefaultLogger = (logPath: string): ILog => {
    return {
        writeTo: logPath,
        format: (req, res) => `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url} ${res.statusCode}`,
        writeConsole: false
    };
}

const addNewLineIfNotExists = (line: string) => {
    const newline = os.EOL;
    if(line.endsWith(newline)) {
        return line;
    } else {
        return line + newline;
    }
}

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void

export const createLogMiddleware = (logger: ILog) => {
    const middleware: ExpressMiddleware  = (req, res, next) => {
        // レスポンス内容が確定してからログを記録する
        res.on('finish', () => {
            const stream =  fs.createWriteStream(logger.writeTo, { flags: 'a' });
            const line = addNewLineIfNotExists(logger.format(req, res));
            stream.write(line);
            stream.close();

            if(logger.writeConsole) {
                console.log(line.trim()); // コンソール側では改行コードは余計
            }
        });

        next();
    };

    return middleware;
}