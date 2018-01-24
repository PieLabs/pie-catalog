import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import * as express from 'express';
import * as gzip from './middleware/gzip';
import * as jsesc from 'jsesc';
import * as r from 'resolve';
import * as webpack from 'webpack';
import * as webpackMiddleware from 'webpack-dev-middleware';

import { AvatarService, ElementService } from '../services';
import { createReadStream, exists, readFile, readJson, stat } from 'fs-extra';
import { extname, join, resolve } from 'path';

import { buildLogger } from 'log-factory';
import { lookup } from 'mime-types';
import polyfills from './polyfills';
import { PackageId } from '../types/index';

const readJsonAsync: (p: string, e: string) => bluebird<any> = bluebird.promisify(readJson);

const existsAsync = (p) => new Promise((resolve) => {
  exists(p, (e) => resolve(e));
});

const readFileAsync: (p: string, e: string) => bluebird<{}> = bluebird.promisify(readFile);

const logger = buildLogger();

const env = process.env.NODE_ENV;

logger.info(`ENV: ${env}`);

export function router(
  avatarService: AvatarService,
  elementService: ElementService): { router: express.Router, views: string } {

  let render = (res) => {
    res.render('index', {
      pretty: true,
      config: {
        avatarUrl: '/avatars/github/:user'
      }
    });
  }

  const router: express.Router = express.Router();

  let tryToLoad = async (p: string) => {
    let filepath = join(__dirname, p);
    logger.info(`[tryToLoad] ${filepath}`);

    let exists = await existsAsync(filepath);
    if (exists) {
      return await readFileAsync(filepath, 'utf8')
        .catch(e => {
          logger.error(e);
          return null;
        });
    } else {
      logger.info(`[tryToLoad] filepath: ${filepath} does not exist`);
      return null;
    }
  }

  let loadVersionInfo = async () => {
    logger.debug('load version info...');
    let pkg = await tryToLoad('../../package.json');
    let sha = await tryToLoad('../../.git-version').then(s => s ? s.trim() : null);
    logger.silly(`got pkg: ${pkg}`);
    logger.silly(`got sha: ${sha}`);
    let version = pkg ? JSON.parse(pkg).version : null;
    return { version, sha }
  }

  let loadVersionInfoOnce = _.memoize(loadVersionInfo);

  if (env === 'dev') {

    const cfg = require('./webpack.config');

    cfg.output.publicPath = '/';
    let compiler = webpack(cfg);
    let middleware = webpackMiddleware(compiler, {
      publicPath: '/',
      noInfo: true
    });
    router.use(middleware)
  } else {
    let dir = join(__dirname, '../../lib/client/public');
    //try and find the .gz version of the file and update the headers accordingly 
    router.use(gzip.staticFiles(dir));
    router.use(express.static(dir));
  }


  router.get(/^\/avatars\/github\/(.*)/, (req, res, next) => {
    logger.silly('avatar params:', req.params);
    avatarService.stream('github', req.params[0])
      .then(s => s.pipe(res))
      .catch(next);
  });

  router.get('/version', (req, res) => {

    loadVersionInfoOnce()
      .then(v => res.json(v))
      .catch(e => {
        logger.error('[GET /version]', e.message);
        res.status(404);
      });
  });

  router.get('/', (req, res) => {
    render(res);
  });

  router.get('/org/:org', (req, res) => {
    let org = req.params.org;

    res.render('org', {
      //the pie-cli catalog externalizes lodash and react - so we need to add thes to the page's runtime for the element to work.
      org: org,
      pretty: true,
      config: {
        avatarUrl: '/avatars/github/:user'
      }
    });
  });


  router.get(/^\/element\/(.*)/, (req, res, next) => {

    if (!req.path.endsWith('/')) {
      res.redirect(req.path + '/');
      return;
    }

    logger.debug('element page: ', req.params);

    const name = req.params[0];
    const id = new PackageId(name);

    elementService.load(id)
      .then(el => {
        res.render('repo', {
          js: _.concat(Array.isArray(el.demo.externals.js) ? el.demo.externals.js : [], [
            '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.js',
            '//cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.js'
            // '/demo/react.min.js'
          ]),
          css: el.demo.externals ? el.demo.externals.css : [],
          org: el.repository.user,
          repo: el.repository.project,
          name: id.name,
          demo: {
            js: `/demo/${el.name}/pie-catalog.bundle.js`,
            config: el.demo.config,
            markup: jsesc(el.demo.markup),
            configureMap: el.demo.configureMap
          },
          pretty: true,
          config: {
            avatarUrl: '/avatars/github/:user'
          }
        })
      })
      .catch(e => {
        logger.error(e.stack);
        res.status(400).send(e.message);
      });
  });

  router.get('/org/*', (req, res, next) => {
    render(res);
  });


  let streamNodeModulePath = (p) => {
    let jsPath = join(__dirname, '/node_modules/', p);
    return createReadStream(jsPath);
  }

  router.use('/polyfills', polyfills);

  let views = join(__dirname, 'views');
  return { router, views }
} 
