const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// JSONリクエストボディを解析するためのミドルウェア
app.use(express.json());

const routesDir = path.join(__dirname, 'route');
console.log(routesDir);

fs.readdirSync(routesDir).forEach((folder) => {
  console.log({folder});
  const folderPath = path.join(routesDir, folder);
  console.log({folderPath});

  if (fs.statSync(folderPath).isDirectory()) {
    fs.readdirSync(folderPath).forEach((file) => {
      const routePath = path.join(folderPath, file);
      const handlers = require(routePath);
      console.log({file, routePath, handlers});

      const routeBase = `/${folder}`;
      console.log({routeBase});

      if (handlers.get) {
        app.get(`${routeBase}/${path.basename(file, '.js')}`, (req, res) => {
          res.json(handlers.get(req));
        });
      }

      if (handlers.post) {
        app.post(`${routeBase}/${path.basename(file, '.js')}`, (req, res) => {
          res.json(handlers.post(req));
        });
      }

      // 他のHTTPメソッド (PUT, DELETEなど) を追加する場合は、同様に追加可能です
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
