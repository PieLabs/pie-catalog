import * as _ from 'lodash';
import * as http from 'http';
import * as url from 'url';

import { Readable, Writable } from 'stream';
import { createReadStream, createWriteStream, ensureDirSync, exists, existsSync } from 'fs-extra';
import { dirname, resolve } from 'path';

import { GithubService } from '../github';
import { buildLogger } from 'log-factory';
import fetch from 'node-fetch';

const logger = buildLogger();

export interface AvatarBackend {
  exists(path: string): Promise<string>;
  readStream(path: string): Promise<Readable>;
  writeStream(path: string): Promise<Writable>;
  //TODO: Add support for http headers etc: Content-Type, Content-Length, ETag, etc
}

export class FileBackend implements AvatarBackend {
  constructor(private root: string) {
    ensureDirSync(root);
  }

  private resolve(path: string) {
    return `${this.root}/${path}`;
  }

  exists(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exists(this.resolve(path), (exists) => {
        resolve(path);
      });
    });
  }

  readStream(path: string) {
    const resolved = this.resolve(path);
    if (existsSync(resolved)) {
      return Promise.resolve(createReadStream(this.resolve(path)));
    } else {
      logger.debug('cant find avatar return a puppy');
      return fetch('http://www.greatdanelady.com/Images/image0067.jpg')
        .then(response => response.body as Readable);
    }
  }

  writeStream(path: string) {
    ensureDirSync(dirname(this.resolve(path)));
    return Promise.resolve(createWriteStream(this.resolve(path)));
  }
}

export default class AvatarService {

  constructor(private backend: AvatarBackend, private github: GithubService) {
  }

  private streamUrlToFile(body: NodeJS.ReadableStream, path: string): Promise<string> {
    return this.backend.writeStream(path).then(ws => {
      return new Promise<string>((resolve, reject) => {
        ws.on('error', reject);
        ws.on('close', () => resolve(path));
        body.pipe(ws);
      });
    });
  }

  async stream(host: string, user: string): Promise<Readable> {
    let path = `${host}/${user}`;
    let exists = await this.backend.exists(path);
    if (!exists) {
      let response = await this.github.avatar(user);
      await this.streamUrlToFile(response.body, path);
    }
    logger.info('[stream] host: ', host, 'user: ', user);
    return this.backend.readStream(path);
  }
}