import * as express from 'express';
import { resolve, join, extname } from 'path';
import { buildLogger } from '../log-factory';
import * as webpackMiddleware from 'webpack-dev-middleware';
import * as webpack from 'webpack';
import * as r from 'resolve';
import AvatarService, { AvatarBackend, FileBackend } from './services/avatar-service';

export { AvatarService, AvatarBackend, FileBackend }

const logger = buildLogger();

const env = process.env.NODE_ENV;

logger.info(`ENV: ${env}`);


export function router(avatarService: AvatarService): { router: express.Router, views: string } {

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
    let compiler = webpack(cfg);
    let middleware = webpackMiddleware(compiler, {
      publicPath: '/',
      noInfo: false
    });
    router.use(middleware)
  }

  //fallback to serving static assets
  router.use(express.static(join(__dirname, 'public')));


  router.get('/avatars/github/:user', (req, res, next) => {
    avatarService.stream('github', req.params.user)
      .then(s => s.pipe(res))
      .catch(next);
  });

  router.get('/', (req, res) => {
    render(res);
  });

  router.get('/element/*', (req, res, next) => {
    render(res);
  });

  router.get('/org/*', (req, res, next) => {
    render(res);
  });

  let views = join(__dirname, 'views');
  return { router, views }
} 
