import * as express from 'express';
import * as http from 'http';

import mkStore from './store';
import { router as getClientRouter } from './client';
import mkApi from './api';
import { init } from './log-factory';
import { join } from 'path';
import { getLogger } from './log-factory';
import { bootstrap, buildOpts } from './bootstrap-services';
import * as minimist from 'minimist';

init('silly');

const logger = getLogger('APP');

var argv = require('minimist')(process.argv.slice(2));

logger.silly('argv: ', argv);

let raw = process.argv.slice(2);
let args: any = minimist(raw);
let opts = buildOpts(args, process.env);

bootstrap(opts)
  .then(({demo, avatar, element, onError, demoRouter}) => {

    const app = express();
    const client = getClientRouter(avatar);
    app.set('view engine', 'pug');

    //client router
    app.set('views', client.views);
    app.use('/', client.router);

    //set up the demo file router...
    if (demoRouter) {
      logger.info(`add the demo router on: ${demoRouter.prefix()}`);
      app.use(demoRouter.prefix(), demoRouter.router());
    }

    //store router
    app.use('/store', mkStore(element));

    //api router
    app.use('/api', mkApi(element, demo.getDemoLink.bind(demo)));

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

