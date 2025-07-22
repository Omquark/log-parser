const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const rateLimit = require('express-rate-limit');
const nextReq = require('next');
const bodyParser = require('body-parser');
const { getFormattedDate } = require('./components/Utility');
const pino = require('pino');
const pinoHttp = require('pino-http');
const logger = pinoHttp({
  logger: pino(`server-${getFormattedDate()}.log`),
  // destination: `server-${getFormattedDate()}.log`,
});



// const logger = require('pino-http')(pinoHttp.destination({ dest: `server-${getFormattedDate()}.log` }));

const dev = process.env.NODE_ENV !== 'production';
const nextApp = nextReq({
  dev: dev,
  conf: {
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    }
  }
});
const handle = nextApp.getRequestHandler();

const bodyParserJsonOptions = {
  limit: '1kb',
}

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //Time in ms to remember requests
  limit: 30, //Limit per IP per windowMS time
  statusCode: 429, //Status code when limit is reached
  message: 'Too may requests', //Message when limit is reached
  //requestWasSuccessful: () => {} //Create a function to add logging?
});

app.use(logger);
app.use(bodyParser.json(bodyParserJsonOptions));
app.use(rateLimiter);
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send({ message: 'SUCCESS' }).status(200);

});

app.all('.', (req, res) => {
  res.send({ message: 'FAILED' }).status(404);
});

// nextApp.prepare().then(async () => {
http.createServer(app).listen(3000, (req, res) => {
});
// });
