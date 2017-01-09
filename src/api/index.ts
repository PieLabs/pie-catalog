import { Router } from 'express';

const r: Router = Router();

r.get('/', (req, res) => {
  res.send('api here...');
});

r.get('/elements', (req, res) => {
  res.json([
    {
      org: 'corespring',
      repo: 'corespring-choice'
    }
  ]);
});

export default r;