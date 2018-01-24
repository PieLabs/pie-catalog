import * as _ from 'lodash';
import * as gunzip from 'gunzip-maybe';
import * as tar from 'tar-stream';

import { ElementService, PieId } from '../services';
import { Readable, Writable } from 'stream';

import { Router } from 'express';
import { StringTransform } from './transforms';
import { buildLogger } from 'log-factory';
import { normalize } from 'path';
import { PackageId } from '../types/index';


// stream in a tar
// read a specific file 
// pipe to next
const logger = buildLogger();

let withString = (fn: (j: string) => Promise<any>): Writable => {
  return new Writable({
    write: (chunk: Buffer, enc, done) => {
      let s = chunk.toString('utf8');
      fn(s)
        .then(() => done())
        .catch(e => done(e));
    }
  });
}

let withJson = (fn: (j: { [key: string]: any }) => Promise<any>): Writable => {
  logger.debug('[withJson]');
  return new Writable({
    write: (chunk: Buffer, enc, done) => {
      let jsonString = chunk.toString('utf8');
      logger.silly('[withJson] write: ', jsonString);
      try {
        let json = JSON.parse(jsonString);
        logger.silly('[withJson] json: ', json);
        fn(json)
          .then(() => done())
          .catch(e => done(e));
      } catch (e) {
        done(e);
      }
    }
  });
}


export const writeStream = (id: PackageId, elementService: ElementService, stream: Readable, name: string, header: any): Writable | void => {
  if (header.type === 'file') {
    let p = elementService.demo.upload(id, name, stream);
    let w = new Writable();
    p.then(d => w.end()).catch(e => w.emit('error', e));
    return w;
  } else {
    logger.debug(`drain this stream: ${name} `)
    stream.resume(); // just auto drain the stream 
    return null;
  }
}

export default (elementService: ElementService): Router => {

  const router: Router = Router();

  router.get('/', (req, res) => {
    res.send('store here...');
  });

  /**
   * ingest a tar.gz file built by [pie-cli](github.com/PieLabs/pie-cli)'s catalog app.
   * The archive is expected to have the following format: 
   * 
   * - pie-catalog-info.json (must be 1st entry in tar) -> saved to db
   * - any-other-file -> saved to demo service
   * 
   * the demo assets are send to an object-store/cdn using a key: 
   * - :name/:filepath
   *
   * where name is extracted from pie-catalog-info.json when the stream first loads.
   */

  router.post('/ingest', async (req, res) => {
    logger.info('ingest....');
    logger.info('params: ', req.params);
    logger.info('query: ', req.query);

    const writeStreams = [];
    let extractComplete = false;

    const respond = (name: string) => {
      logger.debug('[respond] name: ', name);

      if (!extractComplete) {
        logger.debug('[respond] name: ', name, 'extraction is not completed.. wait.');
        return;
      }

      let { done, pending, error } = _.extend({ done: [], pending: [], error: [] }, _.groupBy(writeStreams, 'status'));

      logger.debug('[respond] name: ', name, 'pending streams count: ', pending.length);

      if (pending.length === 0) {

        if (_.isEmpty(error)) {
          res.status(200).json({ success: true, files: done.map(d => d.name) });
        } else {
          let out = {
            success: false,
            errors: _.map(error, e => ({ name: e.name, message: e.error.message }))
          }
          res.status(400).json(out);
        }
      }
    }

    const extract = tar.extract();

    let pieId: PackageId = null;
    let dataBundle = null;
    let bundleString = '';

    const DATA_BUNDLE = 'pie-catalog-data.json';

    extract.on('entry', (header, stream, next) => {
      logger.info('entry: ', header.name, header);


      logger.info('pkg ready', dataBundle !== null, dataBundle && dataBundle.package.name);
      let name = normalize(header.name);

      stream.on('end', async function () {
        if (name === DATA_BUNDLE) {
          logger.silly(' >>> data bundle end');
          dataBundle = JSON.parse(bundleString);
          pieId = new PackageId(dataBundle.package.name);
          await elementService.delete(pieId);
          logger.silly(' >>> data bundle end - call saveBundle');
          elementService.saveBundle(pieId, dataBundle)
            .then(id => {
              pieId = id;
              next();
            })
            .catch(next);
        } else {
          if (!pieId || pieId.name === null) {
            stream.resume();
            next(new Error('no pie id'));
          } else {
            next();
          }
        }
      });

      stream.on('error', function (e) {
        next(e);
      });

      if (name === DATA_BUNDLE) {
        stream.on('data', b => {
          bundleString += b.toString();
        });
      } else {
        if (dataBundle === null || pieId === null) {
          next(new Error(`data bundle isnt ready - ${DATA_BUNDLE} should be the first file in the tar, subsequent entries rely on it.`));
        } else {
          let ws = writeStream(pieId, elementService, stream, name, header);

          logger.info('writeStream for ', name, ws);
          if (ws instanceof Writable) {
            let writeStatus = { name: name, stream: ws, status: 'pending', error: undefined };
            ws.on('finish', () => {
              writeStatus.status = 'done';
              respond(name);
            });

            ws.on('error', (e) => {
              writeStatus.status = 'error';
              writeStatus.error = e;
              respond(name);
            });

            writeStreams.push(writeStatus);
          }
        }
      }

    });

    extract.on('error', (e) => {
      logger.error(e);
      res.status(500).json({ success: false, error: e.message });
    });

    extract.on('finish', () => {
      logger.info('all files in tar listed - done!');
      extractComplete = true;
      respond('');
    });

    req
      .pipe(gunzip())
      .pipe(extract);


  });

  return router;
}
