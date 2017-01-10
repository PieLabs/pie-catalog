import { Router } from 'express';
import { buildLogger } from '../log-factory';
import * as fs from 'fs-extra';
import * as zlib from 'zlib';
import * as tar from 'tar-stream';
import * as stream from 'stream';
import * as gunzip from 'gunzip-maybe';
import * as _ from 'lodash';
import PieId from '../types/pie-id';
import { Streamer } from './streams';

const logger = buildLogger();

export default (streamer: Streamer): Router => {

  const router: Router = Router();

  router.get('/', (req, res) => {
    res.send('store here...');
  });

  /**
   * ingest a zip file build by [pie-cli](github.com/PieLabs/pie-cli)'s catalog app.
   * The zip is expected to have the following format: 
   * 
   * - README.md
   * - docs/schemas/*.json
   * - docs/demo/example.html
   * - docs/demo/pie-item.js
   * - docs/demo/public/*
   * - version-info.json
   * - package.json
   * 
   * the demo assets are send to an object-store/cdn using a key: 
   * - :org/:repo/:tag?|:sha/:filepath
   * 
   * the README, schemas, package.json are stored in a db: 
   * 
   * { org: :org, repo: :repo, versions: [ { tag: :tag?, sha: :sha, readme: '', schemas, package.json }, ...] }
   */

  router.post('/ingest/:org/:repo/:sha', (req, res) => {
    logger.info('ingest....');
    logger.info('params: ', req.params);
    logger.info('query: ', req.query);

    let org = req.params.org;
    let repo = req.params.repo;
    let sha = req.params.sha;
    let tag = req.query.tag;

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

      let id = new PieId(org, repo, sha, tag);

      if (_.startsWith(header.name, 'docs/demo')) {
        stream.pipe(streamer.demoFile(id, header.name));
      } else if (_.startsWith(header.name, 'docs/schemas') && header.type === 'file') {
        stream
          .pipe(streamer.json())
          .pipe(streamer.schema(id, header.name));
      } else if (header.name === 'README.md') {
        stream
          .pipe(streamer.string())
          .pipe(streamer.readme(id));
      } else if (header.name === 'package.json') {
        stream
          .pipe(streamer.json())
          .pipe(streamer.pkg(id));
      } else {
        stream.resume() // just auto drain the stream
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
  });

  return router;
}

