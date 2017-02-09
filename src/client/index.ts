import * as express from 'express';
import { resolve, join, extname } from 'path';
import { buildLogger } from 'log-factory';
import * as webpackMiddleware from 'webpack-dev-middleware';
import * as webpack from 'webpack';
import * as r from 'resolve';
import { AvatarService, ElementService } from '../services';
import * as gzip from './middleware/gzip';
import { lookup } from 'mime-types';
import { stat, readJson, readFile, exists } from 'fs-extra';
import * as jsesc from 'jsesc';
import * as _ from 'lodash';
import * as bluebird from 'bluebird';



const readJsonAsync: (p: string, e: string) => bluebird<{}> = bluebird.promisify(readJson);
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


  router.get('/avatars/github/:user', (req, res, next) => {
    avatarService.stream('github', req.params.user)
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

  router.get('/element/:org/:repo/', (req, res, next) => {

    if (!req.path.endsWith('/')) {
      res.redirect(req.path + '/');
      return;
    }

    logger.debug('element page: ', req.params);

    let {org, repo} = req.params;
    elementService.load(org, repo)
      .then(el => {
        res.render('repo', {
          js: _.concat(el.externals ? el.externals.js : [], [
            '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
            '/demo/react.min.js'
          ]),
          css: el.externals ? el.externals.css : [],
          org: org,
          repo: repo,
          demo: {
            js: `/demo/${el.org}/${el.repo}/${el.tag}/pie-catalog.bundle.js`,
            config: el.demo.config,
            markup: jsesc(el.demo.markup)
          },
          pretty: true,
          config: {
            avatarUrl: '/avatars/github/:user'
          }
        })
      })
      .catch(e => res.status(400).send(e.message));
  });

  router.get('/element/:org/:repo/*', (req, res, next) => {
    let {org, repo} = req.params;
    logger.info(req.params);
    elementService.tag(org, repo)
      .then(tag => {
        res.redirect(`/demo/${org}/${repo}/${tag}/${req.params[0]}`);
      })
      .catch(e => {
        res.status(404).send();
      });
  });

  router.get('/org/*', (req, res, next) => {
    render(res);
  });

  let views = join(__dirname, 'views');
  return { router, views }
} 
