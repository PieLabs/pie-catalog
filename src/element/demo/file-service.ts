import { PieId, DemoService as Api, DemoRouter as Router } from './service';
import { Writable } from 'stream';
import { readFileSync, createReadStream, ensureDirSync, createWriteStream } from 'fs-extra';
import { dirname, join } from 'path';
import * as express from 'express';
import { buildLogger } from '../../log-factory';
const logger = buildLogger();

export default class DemoService implements Api, Router {

  constructor(readonly root: string) {
    logger.silly('demo-service');
    logger.info('demo-service');
  }

  private toPath(id: PieId, name: string) {
    return `${id.org}/${id.repo}/${id.tag}/${name}`;
  }

  private getFilePath(id: PieId, name: string) {
    return join(this.root, this.toPath(id, name));
  }

  stream(id: PieId, name: string): Writable {
    logger.silly('[stream], id', id, name);
    let path = this.getFilePath(id, name);
    logger.silly('[stream] path: ', path);
    ensureDirSync(dirname(path));
    return createWriteStream(path);
  }

  prefix() {
    return '/demo';
  }

  getDemoLink(id: PieId): string {
    return `${this.prefix()}/${this.toPath(id, 'docs/demo/example.html')}`;
  }

  /** for the local file store return a static router that serves up the files. */
  router() {
    let r = express.Router();

    r.get('/react.min.js', (req, res) => {
      let rs = createReadStream(join(__dirname, 'react-w-tap-event.js'));
      rs.pipe(res);
    });

    r.get(/(.*)\/docs\/demo\/example\.html/, (req, res) => {
      logger.debug(req.path);
      let markup = readFileSync(join(this.root, req.path), 'utf8');
      let tweakedReact = '/demo/react.min.js';
      let tweaked = markup.replace(/<script.*react.*<\/script>/, `<script src="${tweakedReact}" type="text/javascript"></script>`);

      res
        .setHeader('Content-Type', 'text/html')
      res.send(tweaked);
    });

    r.use(express.static(this.root));
    return r;
  }
}