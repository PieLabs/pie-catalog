import { Router } from 'express';
import { PieId } from '../services/index';
import { DemoRouter } from '../store/backends/demo/file';

export default function mkApi(demo: DemoRouter) {

  const r: Router = Router();

  r.get('/', (req, res) => {
    res.send('api here...');
  });

  r.get('/elements', (req, res) => {
    res.json([
      {
        org: 'corespring',
        repo: 'corespring-choice',
        version: '1.0.0',
        repoLink: '/element/corespring/corespring-choice',
        description: 'A choice element with support for checkboxes and radio buttons.'
      }
    ]);
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
    res.json({
      org: 'corespring',
      repo: 'corespring-choice',
      version: '1.0.0',
      repoLink: '/element/corespring/corespring-choice',
      description: 'A choice element with support for checkboxes and radio buttons.',
      demoLink: demo.getDemoLink(new PieId('corespring', 'corespring-choice', null, '1.0.0'))
    });
  });

  return r;
}