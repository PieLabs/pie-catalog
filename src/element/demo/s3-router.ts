import { DemoRouter as Router } from './service';
import * as express from 'express';
import { S3 } from 'aws-sdk';
import { buildLogger } from '../../log-factory';
import { replaceReact } from './utils';
import { createReadStream } from 'fs-extra';
import { join } from 'path';

const logger = buildLogger();
/**
 * Alot of the corespring components depend on material-ui which in turn depends on 'inject-tap-event-plugin'.
 * This means that the build of react that's on cdn won't work. The cdn version of react is what's added to the example.html.
 * This router will modify the example.html so that is uses the custom build of react that is part of this application.
 * 
 * It is hoped that once the dependency on 'inject-tap-event-plugin' is gone we can do away with all this.
 */
export default class S3Router implements Router {

  constructor(
    private s3: S3,
    private s3Opts: { prefix: string, bucket: string }) { }

  prefix(): string {
    return '/demo';
  };

  router(): express.Router {
    const r = express.Router();

    /**
     * Tweak the html so that it points to the right markup
     */
    r.get(/(.*)\/docs\/demo\/example\.html/, (req, res) => {

      const params = {
        Bucket: this.s3Opts.bucket,
        Key: `${this.s3Opts.prefix}${req.path}`
      }

      logger.silly('[GET example.htm] params: ', params);
      this.s3.getObject(params, (err, data) => {

        if (err) {
          logger.error(err);
          res.status(500).send('Error loading example.html');
        } else {
          let markup = data.Body.toString();
          logger.silly('[GET example.html] markup: ', markup);
          res.setHeader('Content-Type', 'text/html')
          res.send(replaceReact(markup, `${this.prefix()}/react.min.js`));
        }
      });
    });

    r.get('/react.min.js', (req, res) => {
      let rs = createReadStream(join(__dirname, '../../../lib/element/demo/react-w-tap-event.js'));
      rs.pipe(res);
    });

    /**
     * Pipe all the other assets from s3
     */
    r.get('*', (req, res) => {

      const params = {
        Bucket: this.s3Opts.bucket,
        Key: `${this.s3Opts.prefix}${req.path}`
      }

      logger.silly(`[GET ${req.path}] params: `, params);

      this.s3.getObject(params)
        .on('httpHeaders', function (statusCode, headers) {
          res.set('Content-Length', headers['content-length']);
          res.set('Content-Type', headers['content-type']);
          this.response.httpResponse.createUnbufferedStream()
            .pipe(res);
        })
        .send();
    });
    return r;
  }
}