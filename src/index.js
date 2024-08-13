const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// src/routeディレクトリ内の全てのルートファイルを自動的に読み込む
const routesDir = path.join(__dirname, 'route');

// サブディレクトリの構造に基づいてルートを登録
fs.readdirSync(routesDir).forEach((folder) => {
  const folderPath = path.join(routesDir, folder);

  // サブディレクトリのみ対象
  if (fs.statSync(folderPath).isDirectory()) {
    fs.readdirSync(folderPath).forEach((file) => {
      const routePath = path.join(folderPath, file);
      const route = require(routePath);

      // サブディレクトリの名前を含む形でルートを登録
      app.use(`/${folder}`, route);
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
