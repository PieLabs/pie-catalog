import * as express from 'express';
import { resolve, join, extname } from 'path';
import { buildLogger } from '../log-factory';
import * as webpackMiddleware from 'webpack-dev-middleware';
import * as webpack from 'webpack';
import * as r from 'resolve';

const logger = buildLogger();

const env = process.env.NODE_ENV;

logger.info(`ENV: ${env}`);

export const router: express.Router = express.Router();

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

router.get('/', (req, res) => {
  res.render('index', { pretty: true });
});

router.get('/elements/:org/:repo', (req, res, next) => {
  res.render('index', { pretty: true });
});

export let views = join(__dirname, 'views');
