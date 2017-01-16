import * as express from 'express';
import * as http from 'http';

import mkStore from './store';
import { router as getClientRouter } from './client';
import mkApi from './api';
import { init } from './log-factory';
import { join } from 'path';
import { buildLogger, getLogger } from './log-factory';
import { bootstrap } from './bootstrap-services';

init('silly');

const logger = getLogger('APP');

bootstrap()
  .then(({demo, avatar, element, onError}) => {

    const app = express();
    const client = getClientRouter(avatar);
    app.set('view engine', 'pug');

    //client router
    app.set('views', client.views);
    app.use('/', client.router);

    //set up the demo file router...
    app.use(demo.prefix(), demo.router());

    //store router
    app.use('/store', mkStore(element));

    //api router
    app.use('/api', mkApi(element, demo.getDemoLink.bind(demo)));

    const server = http.createServer(app);

    const port = process.env.PORT || 4001;

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

