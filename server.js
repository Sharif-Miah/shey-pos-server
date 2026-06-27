const express = require('express');
const dbConnect = require('./dbConnect');
const cors = require('cors');
const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
dbConnect();
app.use(express.json());
const itemsRoute = require('./routes/itemRoutes');
const userRoute = require('./routes/userRoutes');
const billRoute = require('./routes/billRoutes');

app.use('/api/items/', itemsRoute);
app.use('/api/users/', userRoute);
app.use('/api/bill/', billRoute);
const port = 3000;

app.get('/', (req, res) => res.send('Hello World! from Api.'));
app.listen(port, () =>
  console.log(`NodeJS server Running at the port ${port}`)
);
