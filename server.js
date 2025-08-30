const express = require('express');
const dbConnect = require('./dbConnect');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const itemsRoute = require('./routes/itemRoutes');

app.use('/api/items/', itemsRoute);
const port = 3000;

app.get('/', (req, res) => res.send('Hello World! from Api.'));
app.listen(port, () =>
  console.log(`NodeJS server Running at the port ${port}`)
);
