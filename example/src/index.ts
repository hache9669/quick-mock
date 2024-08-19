import { Request, Response } from 'express';
import path from 'path';
import { startServer, ILog } from 'rapid-mock';

const routeDir = path.join(__dirname, 'route');
const logPath = path.resolve(__dirname, '../', 'access.log');

// use default log style
// startServer(routeDir, 3000, logPath);

// use custom log style
const logSetting: ILog = {
    writeTo: logPath,
    format: (req:  Request, res: Response) => {
        const now = new Date().toLocaleString('ja-JP');
        const params = { params: req.params, body: req.body };
        const logLine = `[${now}] ${req.ip} ${req.method} ${req.url} ${res.statusCode} ${JSON.stringify(params)}`;
        return logLine;
    },
    writeConsole: true
}
startServer(routeDir, 3000, logSetting);