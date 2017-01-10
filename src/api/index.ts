import { Router } from 'express';
import PieId from '../types/pie-id';
import { Elements } from './services';
import * as _ from 'lodash';

export default function mkApi(elements: Elements, getDemoLink: (PieId) => string) {

  const r: Router = Router();

  r.get('/', (req, res) => {
    res.send('api here...');
  });

  r.get('/elements', (req, res, next) => {

    elements.list()
      .then(result => {

        result = _.map(result, r => {
          r.repoLink = `/element/${r.org}/${r.repo}`
          r.description = r.package.description;
          r.version = r.package.version;
          return r;
        });

        res.json(result)
      });
  });

  r.get('/org/:org', (req, res) => {
    res.json({
      org: 'corespring',
      elements: [
        {
          org: 'corespring',
          repo: 'corespring-choice',
          version: '1.0.0',
          description: 'A choice element with support for checkboxes and radio buttons.',
          repoLink: '/element/corespring/corespring-choice',
        }
      ]
    });
  });

  r.get('/element/:org/:repo', (req, res) => {
    // elements.find(req.params.org, req.params.repo)
    //   .then(result => {

    //   });

    res.json({
      org: 'corespring',
      repo: 'corespring-choice',
      version: '1.0.0',
      repoLink: '/element/corespring/corespring-choice',
      description: 'A choice element with support for checkboxes and radio buttons.',
      demoLink: getDemoLink(new PieId('corespring', 'corespring-choice', null, '1.0.0'))
    });
  });

  return r;
}