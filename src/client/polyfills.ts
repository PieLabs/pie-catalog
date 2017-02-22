import * as express from 'express';
import { resolve, join, extname } from 'path';
import { buildLogger } from 'log-factory';
import * as gzip from './middleware/gzip';
import { lookup } from 'mime-types';
import { stat, readJson, readFile, exists, createReadStream } from 'fs-extra';
import * as _ from 'lodash';

const logger = buildLogger();
const router: express.Router = express.Router();

let streamNodeModulePath = (p) => {
  let jsPath = join(__dirname, '/node_modules/', p);
  return createReadStream(jsPath);
}

let stream = (res, p) => {
  let rs = streamNodeModulePath(p);
  let ext = extname(p);
  res.setHeader('Content-Type', `${lookup(ext)}; charset=utf-8`);
  rs.pipe(res);
}

router.get('/:pkg/*', (req, res) => {
  logger.debug('params:', req.params);
  let p = req.params[0];
  let pkg = req.params.pkg;
  let fullPath = (pkg === 'whatwg-fetch') ? `${pkg}/${p}` : `@webcomponents/${pkg}/${p}`;
  stream(res, fullPath);
});

router.get('/:name.js.map', (req, res) => {
  logger.debug(req.params);
  let { name } = req.params;
  name = name.replace('.min', '');
  let jsPath = `@webcomponents/${name}/${name}.min.js.map`;
  logger.info('jsPath: ', jsPath);
  stream(res, jsPath);
});

export default router;