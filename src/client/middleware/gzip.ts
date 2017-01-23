import * as express from 'express';
import { stat, createReadStream } from 'fs-extra';
import { join } from 'path';

export function staticFiles(dir: string): express.Handler {
  return (req, res, next) => {

    let p = req.path;
    let fullpath = join(dir, p);
    fullpath = fullpath.endsWith('.gz') ? fullpath : `${fullpath}.gz`;

    stat(fullpath, (err, stat) => {
      if (err) {
        next();
      } else {
        if (stat.isFile()) {
          let s = createReadStream()
        } else {
          next();
        }
      }
    });

  }
}