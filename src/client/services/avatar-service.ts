import { Readable, Writable } from 'stream';
import { createWriteStream, createReadStream, exists, ensureDirSync } from 'fs-extra';
import fetch from 'node-fetch';
import * as http from 'http';
import { buildLogger } from '../../log-factory';
const logger = buildLogger();
export interface AvatarBackend {
  exists(path: string): Promise<string>;
  readStream(path: string): Promise<Readable>;
}

class FileBackend implements AvatarBackend {
  constructor(private root: string) {
    ensureDirSync(root);
  }

  exists(path: string) {
    return new Promise((resolve, reject) => {
      exists(path, (exists) => {
        resolve(exists);
      });
    });
  }

  readStream(path: string) {
    return Promise.resolve(createReadStream(path));
  }
}

export default class AvatarService {

  constructor(readonly root: string, private backend: AvatarBackend) {
    logger.info(`set root to: ${root}`);
  }

  private streamUrlToFile(url: string, path: string): Promise<string> {

    logger.debug(`[streamUrlToFile]: ${url} ${path}`);
    return fetch(url)
      .then(r => {
        return new Promise((resolve, reject) => {
          logger.debug(`[streamUrlToFile] writing response to a file stream`);
          let ws = createWriteStream(path);
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
    let path = `${this.root}/${host}/${user}`;
    let exists = await this.backend.exists(path);
    if (!exists) {
      let json = await this.loadFromGithub(user);
      await this.streamUrlToFile(json.avatar_url, path);
    }
    return this.backend.readStream(path);
  }
}