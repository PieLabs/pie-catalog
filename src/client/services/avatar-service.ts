import { Readable, Writable } from 'stream';
import { dirname } from 'path';
import { createWriteStream, createReadStream, exists, ensureDirSync } from 'fs-extra';
import fetch, { } from 'node-fetch';
import * as http from 'http';
import { buildLogger } from '../../log-factory';
import * as url from 'url';
import * as _ from 'lodash';
import { GithubService } from '../../github';

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

  constructor(private backend: AvatarBackend, private github: GithubService) {
  }

  private streamUrlToFile(body: NodeJS.ReadableStream, path: string): Promise<string> {
    return this.backend.writeStream(path).then(ws => {
      return new Promise<string>((resolve, reject) => {
        ws.on('error', reject);
        ws.on('close', () => { resolve(path) });
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
    return this.backend.readStream(path);
  }
}