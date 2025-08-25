const express = require('express');
const dbConnect = require('./dbConnect');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World! from Api.'));
app.listen(port, () =>
  console.log(`NodeJS server Running at the port ${port}`)
);
