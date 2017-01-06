import * as express from 'express';
import * as http from 'http';

import mkStore from './store';
import client from './client';
import api from './api';
import FileStore from './store/backends/demo/file';
import { Demo, Element } from './services';
import MongoElement from './store/backends/element/mongo';
import { init } from './log-factory';
import { join } from 'path';
import { MongoClient, Db } from 'mongodb';
import { buildLogger, getLogger } from './log-factory';

init({ APP: 'silly', mongo: 'debug', default: 'info' });

const logger = getLogger('APP');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pie-catalog';

MongoClient.connect(mongoUri)
  .then((db) => {
    const collection = db.collection('elements');
    const app = express();
    const fileStore = new FileStore(join(process.cwd(), '.file-store'));
    const element: Element = new MongoElement(collection);

    //store router
    app.use('/store', mkStore(fileStore, element));

    //client router
    app.use('/', client);

    //api router
    app.use('/api', api);

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

