import { DemoRouter as Router } from './service';
import * as express from 'express';
import { S3 } from 'aws-sdk';
import { buildLogger } from 'log-factory';
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
type S3Opts = { prefix: string, bucket: string }

let customReactKey = (prefix: string) => `${prefix}/react.min.js`;

export default class S3Router implements Router {

  static build(s3: S3, opts: S3Opts): Promise<S3Router> {
    let rs = createReadStream(join(__dirname, '../../../../lib/element/demo/react-w-tap-event.js'));

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: opts.bucket,
        Key: customReactKey(opts.prefix),
        Body: rs,
        ContentType: 'text/javascript'
      }
      logger.debug('[build] uploading custom react to s3: key:', params.Key);
      s3.upload({
        Bucket: opts.bucket,
        Key: customReactKey(opts.prefix),
        Body: rs,
        ContentType: 'text/javascript'
      }, (err, result) => {
        logger.silly('[build] custom react upload complete');
        if (err) {
          reject(err);
        } else {
          resolve(new S3Router(s3, opts));
        }
      });
    });

  }


  private constructor(
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
    r.get(/(.*)\/example\.html/, (req, res) => {

      const params = {
        Bucket: this.s3Opts.bucket,
        Key: `${this.s3Opts.prefix}${req.path}`
      }

      logger.silly('[GET example.html] params: ', params);
      this.s3.getObject(params, (err, data) => {

        if (err) {
          logger.error(err.toString());
          res.status(500).send('Error loading example.html');
        } else {
          let markup = data.Body.toString();
          logger.silly('[GET example.html] markup: ', markup);
          res.setHeader('Content-Type', 'text/html')
          res.send(replaceReact(markup, `${this.prefix()}/react.min.js`));
        }
      });
    });

    /**
     * Pipe all the other assets from s3
     */
    r.get('*', (req, res) => {

      const params: any = {
        Bucket: this.s3Opts.bucket,
        Key: `${this.s3Opts.prefix}${req.path}`
      }

      if (req.headers['if-none-match']) {
        params.IfNoneMatch = req.headers['if-none-match'];
      }

      if (req.headers['if-modified-since']) {
        try {
          params.IfModifiedSince = Date.parse(req.headers['if-modified-since']);
        } catch (e) {
          logger.warn('failed to parse: if-modified-since header as date: ', req.headers['if-modified-since']);
        }
      }

      logger.silly(`[GET ${req.path}] params: `, params);

      this.s3.getObject(params)
        .on('httpHeaders', function (statusCode, headers) {
          if (statusCode === 304) {
            res.status(statusCode).send();
          } else {
            logger.silly(`[GET ${req.path}] s3 statusCode: ${statusCode}, headers: ${headers}`);
            res.set('Content-Length', headers['content-length']);
            res.set('Content-Type', headers['content-type']);
            res.set('ETag', headers['etag']);
            res.set('Date', headers['date']);
            res.set('Cache-Control', 'public, max-age=0');
            res.set('Last-Modified', headers['last-modified']);

            logger.silly(`[GET ${req.path}] params: `, res.header);
            this.response.httpResponse.createUnbufferedStream()
              .pipe(res);

          }
        })
        .send();
    });
    return r;
  }
}