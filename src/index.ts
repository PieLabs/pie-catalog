import * as express from 'express';
import * as http from 'http';

import mkStore from './store';
import { AvatarService, router as getClientRouter } from './client';
import mkApi from './api';
import { init } from './log-factory';
import ElementService from './element/mongo-service';
import DemoService from './element/demo/file-service';
import { DemoRouter } from './element/demo/service';
import { join } from 'path';
import { MongoClient, Db } from 'mongodb';
import { buildLogger, getLogger } from './log-factory';

init('silly');
//{ APP: 'silly', mongo: 'debug', default: 'silly' });

const logger = getLogger('APP');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pie-catalog';

logger.info('mongoUri:', mongoUri);

MongoClient.connect(mongoUri)
  .then((db) => {
    const collection = db.collection('elements');
    const app = express();

    const demoService = new DemoService(join(process.cwd(), '.demo-service'));
    const demoRouter = (demoService as DemoRouter);
    const elementService = new ElementService(collection, demoService);
    const avatarService = new AvatarService(join(process.cwd(), '.avatar-service'));
    const client = getClientRouter(avatarService);
    app.set('view engine', 'pug');
    app.set('views', client.views);

    //set up the demo file router...
    app.use(demoRouter.prefix(), demoRouter.router());

    //store router
    app.use('/store', mkStore(new ElementService(collection, demoService)));

    //client router
    app.use('/', client.router);

    //api router
    app.use('/api', mkApi(elementService, demoRouter.getDemoLink.bind(demoRouter)));

    const server = http.createServer(app);

    const port = process.env.PORT || 4001;

    server.on('close', (e) => {
      console.error('error', e);
    });

    server.on('error', (e) => {
      console.error(e);
    });

    server.on('listening', () => {
      console.log(`server listening on port: ${port}`);
    });

    server.listen(port);
  })
  .catch(e => {
    logger.error(e)
  });

