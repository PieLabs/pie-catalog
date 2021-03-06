import * as express from 'express';
import * as http from 'http';
import * as minimist from 'minimist';

import { bootstrap, buildOpts } from './services';
import { getLogger, init } from 'log-factory';

import { router as getClientRouter } from './client';
import { join } from 'path';
import mkApi from './api';
import mkStore from './store';

var argv = require('minimist')(process.argv.slice(2));

let raw = process.argv.slice(2);
let args: any = minimist(raw);
let logConfig = process.env['LOG_CONFIG'] || args.logConfig || 'info';

init({
  console: true,
  log: logConfig
});

const logger = getLogger('APP');
logger.silly('argv: ', argv);

process.on('unhandledRejection', (reason, p: Promise<any>) => {
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

let opts = buildOpts(args, process.env);

bootstrap(opts)
  .then(({ demoService, avatar, element, onError, demoRouter }) => {

    const app = express();
    const client = getClientRouter(avatar, element);
    app.set('view engine', 'pug');

    //client router
    app.set('views', client.views);
    app.use('/', client.router);

    //set up the demo file router...
    logger.info(`add the demo router on: ${demoRouter.prefix()}`);
    app.use(demoRouter.prefix(), demoRouter.router());

    //store router
    app.use('/store', mkStore(element));

    //api router
    app.use('/api', mkApi(element, demoService.getDemoLink.bind(demoService)));

    const server = http.createServer(app);

    const port = args.port || process.env.PORT || 4001;

    server.on('close', (e) => {
      console.error('error', e);
    });

    server.on('error', (e) => {
      console.error(e);
      onError();
    });

    server.on('listening', () => {
      console.log(`server listening on port: ${port}`);
    });

    server.listen(port);
  })
  .catch(e => {
    logger.error(e)
  });

