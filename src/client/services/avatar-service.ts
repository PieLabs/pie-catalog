import { Readable, Writable } from 'stream';
import { dirname } from 'path';
import { createWriteStream, createReadStream, exists, ensureDirSync } from 'fs-extra';
import fetch from 'node-fetch';
import * as http from 'http';
import { buildLogger } from '../../log-factory';
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

  exists(path: string) {
    return new Promise((resolve, reject) => {
      exists(this.resolve(path), (exists) => {
        resolve(exists);
      });
    });
  }

  readStream(path: string) {
    return Promise.resolve(createReadStream(this.resolve(path)));
  }

  writeStream(path: string) {
    ensureDirSync(dirname(this.resolve(path)));
    return Promise.resolve(createWriteStream(this.resolve(path)));
  }
}

export default class AvatarService {

  constructor(private backend: AvatarBackend) {
  }

  private async streamUrlToFile(url: string, path: string): Promise<string> {

    logger.debug(`[streamUrlToFile]: ${url} ${path}`);
    return fetch(url)
      .then(r => {
        return new Promise(async (resolve, reject) => {
          logger.debug(`[streamUrlToFile] writing response to a file stream`);
          let ws = await this.backend.writeStream(path);
          ws.on('error', reject);
          ws.on('close', () => { resolve(path) });
          r.body.pipe(ws)
        });
      })
      .then(() => path);
  }

  private async loadFromGithub(user: string): Promise<any> {
    let response = await fetch(`http://api.github.com/users/${user}`);
    return response.json();
  }

  async stream(host: string, user: string): Promise<Readable> {
    let path = `${host}/${user}`;
    let exists = await this.backend.exists(path);
    if (!exists) {
      let json = await this.loadFromGithub(user);
      logger.debug('avatar_url: ', json.avatar_url);
      await this.streamUrlToFile(`${json.avatar_url}&s=40`, path);
    }
    return this.backend.readStream(path);
  }
}