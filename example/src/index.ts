import path from 'path';
import { startServer } from 'rapid-mock';

const routeDir = path.join(__dirname, 'route');
startServer(routeDir, 3000);