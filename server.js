const express = require('express');
const dbConnect = require('./dbConnect');
const app = express();
app.use(express.json());
const itemsRoute = require('./routes/itemRoutes');

app.use('/api/items/', itemsRoute);
const port = 3000;

app.get('/', (req, res) => res.send('Hello World! from Api.'));
app.listen(port, () =>
  console.log(`NodeJS server Running at the port ${port}`)
);
