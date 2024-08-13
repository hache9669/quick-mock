// index.js
const express = require('express');
const app = express();
const port = 3000;

// ルートをインポート
const helloRoute = require('./route/api/hello');

// ルートを適用
app.use('/api', helloRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});