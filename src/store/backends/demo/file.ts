import { Readable, Writable } from 'stream';
import PieId from '../../../types/pie-id';
import { createWriteStream, ensureDirSync } from 'fs-extra';
import { dirname, join } from 'path';
import { Demo } from '../../../services';

export default class FileStore implements Demo {

  constructor(readonly root: string) { }

  private getFilePath(id: PieId, name: string) {
    return join(this.root, `${id.org}/${id.repo}/${id.tag || id.sha}/${name}`);
  }

  save(id: PieId, name: string): Writable {
    let path = this.getFilePath(id, name);
    ensureDirSync(dirname(path));
    const fileStream = createWriteStream(path);
    return createWriteStream(path);
  }
}