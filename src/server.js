/* eslint linebreak-style: ["error", "windows"] */
import express from 'express';
import path from 'path';
import volleyball from 'volleyball';
import router from './routes/main';
import apiRoutes from './routes/api/routes';
// import debug from 'debug';
const app = express();
const port = 5000;

app.use(volleyball);
app.set('port', process.env.PORT || 5000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../UI/')));

app.use('/', router);
app.use('/api/v1/', apiRoutes);

app.use((req, res) => {
  res.status(404);
});

// catch all
app.use((err, req, res) => {
  res.status(err.status || 500);
});

app.listen(port, () => console.log(` app listening on port ${port}!`));
