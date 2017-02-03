import * as express from 'express';
import { resolve, join, extname } from 'path';
import { buildLogger } from '../log-factory';
import * as webpackMiddleware from 'webpack-dev-middleware';
import * as webpack from 'webpack';
import * as r from 'resolve';
import { AvatarService, ElementService } from '../services';
import * as gzip from './middleware/gzip';
import { lookup } from 'mime-types';
import { stat } from 'fs-extra';
import * as jsesc from 'jsesc';

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
          js: [
            '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
            '/demo/react.min.js'
          ],
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
    logger.info(req.headers);
    logger.info(req.params);
    res.redirect(`/demo/${org}/${repo}/1.5.0/${req.params[0]}`);
  });

  router.get('/org/*', (req, res, next) => {
    render(res);
  });

  let views = join(__dirname, 'views');
  return { router, views }
} 
