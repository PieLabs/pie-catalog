import { Router } from 'express';

const r: Router = Router();

r.get('/', (req, res) => {
  res.send('api here...');
});

export default r;