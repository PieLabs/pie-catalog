import { Router } from 'express';
import { buildLogger } from '../log-factory';
import * as tar from 'tar-stream';
import { Readable, Writable } from 'stream';
import * as gunzip from 'gunzip-maybe';
import * as _ from 'lodash';
import { PieId, ElementService } from '../element/service';
import { StringTransform } from './transforms';
import { normalize } from 'path';

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

export let writeStream = (id: PieId, elementService: ElementService, stream: Readable, name: string, header: any): Writable | void => {
  if (name === 'pie-pkg/package.json') {
    return stream
      .pipe(new StringTransform())
      .pipe(withJson(json => elementService.savePkg(id, json)));

  } else if (name === 'pie-pkg/README.md') {
    return stream
      .pipe(new StringTransform())
      .pipe(withString(s => elementService.saveReadme(id, s)));

  } else if (_.startsWith(name, 'schemas') && header.type === 'file') {
    return stream
      .pipe(new StringTransform())
      .pipe(withJson(json => elementService.saveSchema(id, name, json)));

  } else if (header.type === 'file') {
    let p = elementService.demo.upload(id, name, stream);
    let w = new Writable();
    p.then((d) => w.end())
      .catch(e => w.emit('error', e));
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
   * ingest a zip file build by [pie-cli](github.com/PieLabs/pie-cli)'s catalog app.
   * The zip is expected to have the following format: 
   * 
   * - pie-pkg/README.md -> to elementService
   * - pie-pkg/package.json -> to elementService 
   * - schemas/*.json  -> to elementService
   * - * -> to demo service
   * 
   * the demo assets are send to an object-store/cdn using a key: 
   * - :org/:repo/:tag?|:sha/:filepath
   * 
   * the README, schemas, package.json are stored in a db: 
   * 
   * { org: :org, repo: :repo, versions: [ { tag: :tag?, sha: :sha, readme: '', schemas, package.json }, ...] }
   */

  router.post('/ingest/:org/:repo/:tag', async (req, res) => {
    logger.info('ingest....');
    logger.info('params: ', req.params);
    logger.info('query: ', req.query);

    let writeStreams = [];
    let extractComplete = false;
    let {org, repo, tag} = req.params;
    let id = PieId.build(org, repo, tag);


    let respond = (name: string) => {
      logger.debug('[respond] name: ', name);

      if (!extractComplete) {
        logger.debug('[respond] name: ', name, 'extraction is not completed.. wait.'); 0
        return;
      }

      let {done, pending, error} = _.extend({ done: [], pending: [], error: [] }, _.groupBy(writeStreams, 'status'));

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

    if (!id) {
      res.status(400).json({ error: `org,repo,tag not valid: ${org}, ${repo}, ${tag}` });
    } else {

      await elementService.reset(id);

      let extract = tar.extract();

      extract.on('entry', (header, stream, next) => {
        logger.info('entry: ', header);
        logger.silly('entry: ', header);

        stream.on('end', function () {
          next(); // ready for next entry
        });

        stream.on('error', function (e) {
          next(e);
        });

        let name = normalize(header.name);
        let ws = writeStream(id, elementService, stream, name, header);

        if (ws) {
          let writeStatus = { name: name, stream: ws, status: 'pending' };
          ws.on('finish', () => {
            writeStatus.status = 'done';
            respond(name);
          });

          ws.on('error', (e) => {
            writeStatus[name].status = 'error';
            writeStatus[name].error = e;
            respond(name);
          });

          writeStreams.push(writeStatus);
        }
      });

      extract.on('error', (e) => {
        logger.error(e);
        res.status(500).json({ success: false, error: e.message });
      });

      extract.on('finish', function () {
        logger.info('all files in tar listed - done!');
        extractComplete = true;
        respond('');
      });

      req.pipe(gunzip()).pipe(extract);

    }

  });

  return router;
}

