import fs from 'fs';
import { Request, Response } from 'express';
import path from 'path';
import { startServer } from 'rapid-mock';

const routeDir = path.join(__dirname, 'route');
const logPath = path.resolve(__dirname, '../', 'access.log');

// use default log style
// => [2024-08-20T03:40:43.289Z] ::1 GET /api/hello 200
// startServer(routeDir, 3000, logPath);

// use custom log style
// => [2024/8/20 12:39:40] ::1 GET /api/hello 200 {"params":{},"query":{},"body":{}}
const format = (req:  Request, res: Response) => {
    const now = new Date().toLocaleString('ja-JP');
    const params = { params: req.params, query: req.query, body: req.body };
    const logLine = `[${now}] ${req.ip} ${req.method} ${req.url} ${res.statusCode} ${JSON.stringify(params)}`;
    return logLine;
};
startServer(
    routeDir, 
    3000, 
    logPath,
    { format, writeConsole: true },
    { 
        key: fs.readFileSync(path.resolve(__dirname, '../', 'keys', 'example.key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../', 'keys', 'example.cert.pem'))
    }
);
