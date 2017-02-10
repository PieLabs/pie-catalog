import { Router } from 'express';
import { PieId, ElementService } from '../services';
import { buildLogger } from 'log-factory';
const logger = buildLogger();

import * as _ from 'lodash';

export default function mkApi(service: ElementService, getDemoLink: (PieId) => string) {

  const r: Router = Router();

  r.get('/', (req, res) => {
    res.send('api here...');
  });

  r.get('/element', (req, res, next) => {

    service.list({ skip: 0, limit: 0 })
      .then(result => {

        result.elements = _.map(result.elements, r => {
          r.repoLink = `/element/${r.org}/${r.repo}`
          return r;
        });

        res.json(result)
      });
  });

  r.get('/org/:org', (req, res) => {

    service.listByOrg(req.params.org, { skip: 0, limit: 0 })
      .then(result => {
        res.json({
          count: result.count,
          org: req.params.org,
          elements: result.elements
        });
      });
  });

  r.delete('/element/:org/:repo', (req, res) => {
    service.delete(req.params.org, req.params.repo)
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

  r.get('/element/:org/:repo', (req, res) => {

    let {org, repo} = req.params;

    service.load(org, repo)
      .then(r => {
        logger.debug(`[/element/${org}/${repo}] got result`);
        let id = new PieId(r.org, r.repo, r.tag);
        (r as any).demoLink = getDemoLink(id);
        r.schemas = r.schemas || [];
        res.json(r);
      })
      .catch(e => {
        res.status(404).send();
      });
  });

  return r;
}