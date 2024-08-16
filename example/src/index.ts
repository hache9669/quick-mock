import path from 'path';
import { startServer } from 'quick-mock';

const routeDir = path.join(__dirname, 'route');
startServer(routeDir, 3000);