import * as express from 'express';
import { resolve, join, extname } from 'path';
import { buildLogger } from '../log-factory';
import * as webpackMiddleware from 'webpack-dev-middleware';
import * as webpack from 'webpack';
import * as r from 'resolve';
import { AvatarService } from '../services';
import * as gzip from './middleware/gzip';
import { lookup } from 'mime-types';
import { stat } from 'fs-extra';


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

  router.get('/element/*', (req, res, next) => {
    render(res);
  });

  router.get('/org/*', (req, res, next) => {
    render(res);
  });

  let views = join(__dirname, 'views');
  return { router, views }
} 
