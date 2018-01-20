import * as _ from 'lodash';

import { ElementService, PieId } from '../services';

import { Router } from 'express';
import { buildLogger } from 'log-factory';
import { PackageId } from '../types/index';

const logger = buildLogger();


export default function mkApi(service: ElementService, getDemoLink: (PieId) => string) {

  const r: Router = Router();

  r.get('/', (req, res) => {
    res.send('api here...');
  });

  r.get('/element', (req, res, next) => {

    service.list({ skip: 0, limit: 0 })
      .then(result => {

        result.elements = _.map(result.elements, (r: any) => {
          r.repoLink = `/element/${r.name}`
          return r;
        });

        res.json(result)
      });
  });

  r.get('/user/:user', (req, res) => {

    const { user } = req.params;

    service.listByRepoUser(user, { skip: 0, limit: 0 })
      .then(result => {
        res.json({
          count: result.count,
          org: req.params.org,
          elements: result.elements
        });
      });
  });

  r.delete('/element/:name', (req, res) => {
    const { name } = req.params;
    const id = new PackageId(name)
    service.delete(id)
      .then((result) => {
        if (result.ok) {
          res.json({ success: true });
        } else {
          res.status(result.statusCode).json({ error: result.error });
        }
      })
      .catch(e => {
        res.status(500).json({ error: e.message });
      })
  });

  const handler = nameFn => (req, res) => {

    const name = nameFn(req.params);
    logger.silly('[load] name: ', name);
    const id = new PackageId(name);
    service.load(new PackageId(name))
      .then(r => {
        logger.debug(`[/element/${name}] got result`);
        (r as any).demoLink = getDemoLink(id);
        r.schemas = r.schemas || [];
        res.json(r);
      })
      .catch(e => {
        logger.info('error loading: ', req.path, e.message);
        res.status(404).json({ name: id.name });
      });
  };

  r.get('/element/:scope/:name', handler(p => `${p.scope}/${p.name}`));
  r.get('/element/:name', handler(p => `${p.name}`));

  return r;
}