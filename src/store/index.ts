import { Router } from 'express';
import { buildLogger } from '../log-factory';
import * as tar from 'tar-stream';
import { Writable } from 'stream';
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
  return new Writable({
    write: (chunk: Buffer, enc, done) => {
      let jsonString = chunk.toString('utf8');
      let json = JSON.parse(jsonString);
      fn(json)
        .then(() => done())
        .catch(e => done(e));
    }
  });
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

    let org = req.params.org;
    let repo = req.params.repo;
    let tag = req.params.tag;

    let id = PieId.build(org, repo, tag);

    if (!id) {
      res.status(400).json({ error: `org,repo,tag not valid: ${org}, ${repo}, ${tag}` });
    } else {

      await elementService.reset(id);

      let extract = tar.extract();

      let entries = [];

      extract.on('entry', function (header, stream, next) {
        logger.info('entry: ', header);

        entries.push(header.name);

        stream.on('end', function () {
          next(); // ready for next entry
        });

        stream.on('error', function (e) {
          next(e);
        });

        let name = normalize(header.name);

        if (name === 'pie-pkg/package.json') {
          stream
            .pipe(new StringTransform())
            .pipe(withJson(json => elementService.savePkg(id, json)));

        } else if (name === 'pie-pkg/README.md') {
          stream
            .pipe(new StringTransform())
            .pipe(withString(s => elementService.saveReadme(id, s)));

        } else if (_.startsWith(name, 'schemas') && header.type === 'file') {
          stream
            .pipe(new StringTransform())
            .pipe(withJson(json => elementService.saveSchema(id, name, json)));

        } else if (header.type === 'file') {
          elementService.demo.upload(id, name, stream, (err) => {
            next(err);
          });
        } else {
          logger.debug(`drain this stream: ${name} `)
          stream.resume(); // just auto drain the stream
        }

      });

      extract.on('error', (e) => {
        logger.error(e);
      });

      extract.on('finish', function () {
        logger.info('all files in tar listed - done!');
        if (entries.length === 0) {
          res.status(401).send('Cant read tar file');
        } else {
          res.send('done');
        }
      });

      req.pipe(gunzip()).pipe(extract);

    }

  });

  return router;
}

