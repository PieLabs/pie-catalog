import * as express from 'express';

const r: express.Router = express.Router();

r.get('/', (req, res) => {
  res.send('client here...!!');
});

export default r; 