import 'reflect-metadata';
import bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import { requireAuth } from './middleware/auth.middleware';

const http = require('http');
const fs = require('fs');

require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

process.env.TZ = 'America/Argentina/Cordoba';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

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
  http
    .createServer(app)
    .listen(process.env.PORT || 8080, process.env.HOSTNAME, () => {
      console.log(
        `-- ${new Date()} --\n-- Server running on http://${
          process.env.HOSTNAME
        }:${process.env.PORT} -- \n-- Healthcheck endpoint on  http://${
          process.env.HOSTNAME
        }:${process.env.PORT}/healthcheck --`,
      );
    });
};

(async () => {
  await startServer();
})();
