/* eslint linebreak-style: ["error", "windows"] */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import volleyball from 'volleyball';
import bodyParser from 'body-parser';
import config from './config/config';
import routes from './routes/main';
import apiRoutes from './routes/api/routes';

dotenv.config();
const app = express();

const environment = process.env.NODE_ENV; // development
const stage = config[environment];

if (environment !== 'production') {
  app.use(volleyball);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// the API routes
app.use(express.static(path.join('UI')));
app.use('/', routes);
app.use('/api/v1/', apiRoutes);


app.use((req, res) => {
  res.status(404);
  res.send('page does not exist');
});

// catch all
app.use((err, req, res) => {
  res.status(err.status || 500);
});

app.listen(`${stage.port}`, () => console.log(` app listening on port ${stage.port}!`));

module.exports = app;
