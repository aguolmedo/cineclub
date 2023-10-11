import 'reflect-metadata';
import bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import { requireAuth } from './middleware/auth.middleware';

const http = require('http');
const cors = require('cors');

require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

process.env.TZ = 'America/Argentina/Cordoba';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(
  cors({
    origin: '*',
  }),
);

AppRoutes.forEach((route) => {
  if (route.auth)
    app.use(route.path, requireAuth, (request, response, next) => {
      route
        .action(request, response)
        .then(() => next)
        .catch((err) => next(err));
    });
  app.use(route.path, (request, response, next) => {
    route
      .action(request, response)
      .then(() => next)
      .catch((err) => next(err));
  });
});

const startServer = async () => {
  http.createServer(app).listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`-- ${new Date()} --\n-- Server running --`);
  });
};

(async () => {
  await startServer();
})();
