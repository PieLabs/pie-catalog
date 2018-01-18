import * as _ from 'lodash';
import * as gunzip from 'gunzip-maybe';
import * as tar from 'tar-stream';

import { ElementService, PieId } from '../services';
import { Readable, Writable } from 'stream';

import { Router } from 'express';
import { StringTransform } from './transforms';
import { buildLogger } from 'log-factory';
import { normalize } from 'path';


// stream in a tar
// read a specific file 
// pipe to next
const logger = buildLogger();

let withString = (fn: (j: string) => Promise<any>): Writable => {
  return new Writable({
    write: (chunk: Buffer, enc, done) => {
      let s = chunk.toString('utf8');
      fn(s)
        .then(() => done())
        .catch(e => done(e));
    }
  });
}

let withJson = (fn: (j: { [key: string]: any }) => Promise<any>): Writable => {
  logger.debug('[withJson]');
  return new Writable({
    write: (chunk: Buffer, enc, done) => {
      let jsonString = chunk.toString('utf8');
      logger.silly('[withJson] write: ', jsonString);
      try {
        let json = JSON.parse(jsonString);
        logger.silly('[withJson] json: ', json);
        fn(json)
          .then(() => done())
          .catch(e => done(e));
      } catch (e) {
        done(e);
      }
    }
  });
}

type Parts = {
  pkg: any | undefined,
  readme: any | undefined
}

class PendingElement {

  private name: string;
  private version: string;
  private id: PieId | undefined;

  private promise: Promise<any>;
  private resolve: (d: any) => any;
  private reject: (e: Error) => any;
  private results: Parts;
  private pending: Parts;

  constructor(private service: ElementService) {
    this.id = undefined;
    this.results = {
      pkg: undefined,
      readme: undefined
    }

    this.pending = {
      pkg: undefined,
      readme: undefined
    }

    this.promise = new Promise<any>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  savePkg(pkg: any): void {
    this.name = pkg.name;
    this.version = pkg.version;
    this.id = PieId.build("org", "repo", this.version);
    this.pending.pkg = pkg;
    this.saveAll();
    this.service.savePkg(this.id, pkg)
      .then(v => {
        this.results.pkg = v;
        this.flushPending();
        this.flushPromise();
      })
      .catch(e => {
        this.results.pkg = e;
        this.flushPromise();
      });
  }
  saveAll() {
    if (Object.keys(this.pending).every(k => this.pending[k] !== undefined)) { }
  }
  flushPromise() {
    const allResultsIn = Object.keys(this.results).every(k => this.results[k] !== undefined);
    if (allResultsIn) {
      const hasErrors = Object.keys(this.results).some(k => this.results[k] instanceof Error);

      if (hasErrors) {
        this.reject(new Error('pending failed'))
      } else {
        this.resolve({});
      }
    }
  }

  flushPending() {
    if (this.pending.readme) {
      this.saveReadme(this.pending.readme);
    }
  }

  saveReadme(contents: string): any {
    if (this.id === undefined) {
      this.pending.readme = contents;
    } else {
      this.service.saveReadme(this.id, contents)
        .then(d => {
          this.results.readme = d;
          this.flushPromise();
        })
        .catch(e => {
          this.results.readme = e;
          this.flushPromise();
        })
    }
  }

  saveSchema(name: string, json: any) {

  }

  saveConfigureMap(json: any) {

  }

  getPromise(): Promise<any> {
    return this.promise;
  }
}

export let writeStream = (id: PieId, elementService: ElementService, stream: Readable, name: string, header: any): Writable | void => {
  if (name === 'pie-pkg/package.json') {
    return stream
      .pipe(new StringTransform())
      .pipe(withJson(json => elementService.savePkg(id, json)));

  } else if (name === 'pie-pkg/README.md') {
    return stream
      .pipe(new StringTransform())
      .pipe(withString(s => elementService.saveReadme(id, s)));

  } else if (name === 'pie-pkg/externals.json') {
    return stream
      .pipe(new StringTransform())
      .pipe(withJson(s => {
        let externals = {
          js: s['js'] || [],
          css: s['css'] || []
        }
        return elementService.saveExternals(id, externals);
      }));
  } else if (_.startsWith(name, 'schemas') && header.type === 'file') {
    return stream
      .pipe(new StringTransform())
      .pipe(withJson(json => elementService.saveSchema(id, name, json)));

  } else if (name === 'pie-pkg/configure-map.json') {
    return stream
      .pipe(new StringTransform())
      .pipe(withJson(json => elementService.saveConfigureMap(id, json)));
  } else if (header.type === 'file') {
    let p = elementService.demo.upload(id, name, stream);
    let w = new Writable();
    p.then((d) => w.end())
      .catch(e => w.emit('error', e));
    return w;
  } else {
    logger.debug(`drain this stream: ${name} `)
    stream.resume(); // just auto drain the stream 
    return null;
  }
}

export default (elementService: ElementService): Router => {

  const router: Router = Router();

  router.get('/', (req, res) => {
    res.send('store here...');
  });

  /**
   * ingest a zip file build by [pie-cli](github.com/PieLabs/pie-cli)'s catalog app.
   * The zip is expected to have the following format: 
   * 
   * - pie-pkg/README.md -> to elementService
   * - pie-pkg/package.json -> to elementService 
   * - schemas/*.json  -> to elementService
   * - * -> to demo service
   * 
   * the demo assets are send to an object-store/cdn using a key: 
   * - :org/:repo/:tag?|:sha/:filepath
   * 
   * the README, schemas, package.json are stored in a db: 
   * 
   * { org: :org, repo: :repo, versions: [ { tag: :tag?, sha: :sha, readme: '', schemas, package.json }, ...] }
   */

  router.post('/ingest/:org/:repo/:tag', async (req, res) => {
    logger.info('ingest....');
    logger.info('params: ', req.params);
    logger.info('query: ', req.query);

    let writeStreams = [];
    let extractComplete = false;
    let { org, repo, tag } = req.params;
    let id = PieId.build(org, repo, tag);


    let respond = (name: string) => {
      logger.debug('[respond] name: ', name);

      if (!extractComplete) {
        logger.debug('[respond] name: ', name, 'extraction is not completed.. wait.');
        return;
      }

      let { done, pending, error } = _.extend({ done: [], pending: [], error: [] }, _.groupBy(writeStreams, 'status'));

      logger.debug('[respond] name: ', name, 'pending streams count: ', pending.length);

      if (pending.length === 0) {

        if (_.isEmpty(error)) {
          res.status(200).json({ success: true, files: done.map(d => d.name) });
        } else {
          let out = {
            success: false,
            errors: _.map(error, e => ({ name: e.name, message: e.error.message }))
          }
          res.status(400).json(out);
        }
      }
    }

    if (!id) {
      res.status(400).json({ error: `org,repo,tag not valid: ${org}, ${repo}, ${tag}` });
    } else {

      await elementService.reset(id);

      let extract = tar.extract();

      extract.on('entry', (header, stream, next) => {
        logger.info('entry: ', header);
        logger.silly('entry: ', header);

        stream.on('end', function () {
          next(); // ready for next entry
        });

        stream.on('error', function (e) {
          next(e);
        });

        let name = normalize(header.name);
        let ws = writeStream(id, elementService, stream, name, header);

        if (ws) {
          let writeStatus = { name: name, stream: ws, status: 'pending', error: undefined };

          logger.silly('name: ', name);

          ws.on('finish', () => {
            writeStatus.status = 'done';
            respond(name);
          });

          ws.on('error', (e) => {
            writeStatus.status = 'error';
            writeStatus.error = e;
            respond(name);
          });

          writeStreams.push(writeStatus);
        }
      });

      extract.on('error', (e) => {
        logger.error(e);
        res.status(500).json({ success: false, error: e.message });
      });

      extract.on('finish', function () {
        logger.info('all files in tar listed - done!');
        extractComplete = true;
        respond('');
      });

      req
        .pipe(gunzip())
        .pipe(extractJson('package.json', pkg => console.log('got pkg')))
        .pipe(extract);

    }

  });

  return router;
}

function extractJson(name: string, fn: (a: any) => void) {
  return stream => {
    const extract = tar.extract();
    extract.on('entry', (header, stream, next) => {

      stream.on('end', () => {
        next();
      });

      stream.on('error', e => {
        next(e);
      });

      if (header.name === name) {
        fn(stream);
      } else {
        stream.resume();
      }

    });
    extract.on('finish', () => {

    });
    stream.pipe(extract);
  }

}