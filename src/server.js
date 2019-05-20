/* eslint linebreak-style: ["error", "windows"] */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import validator from 'express-validator';
import volleyball from 'volleyball';
import bodyParser from 'body-parser';
// import config from './config/config';
import routes from './routes/main';
import apiRoutes from './routes/api/routes';

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;

if (port !== 'production') {
  app.use(volleyball);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(validator());
// the API routes
app.use(express.static(path.join('UI')));
app.use('/', routes);
app.use('/api/v1/', apiRoutes);

// routes that dont exist should be caught
app.use((req, res) => {
  res.status(404);
  res.send('page does not exist');
});


// catch all
app.use((err, req, res) => {
  res.status(err.status || 500);
});

app.listen(`${port}`, () => console.log(` app listening on port ${port}!`));

module.exports = app;
