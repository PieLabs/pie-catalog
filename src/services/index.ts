import PieId from '../types/pie-id';
import { Readable, Writable, Transform } from 'stream';

export { Readable, Writable }
export { PieId }

export interface Demo {
  save(id: PieId, name: string): Writable;
}

export interface Element {
  schema(id: PieId, name: string): Writable;
  readme(id: PieId): Writable;
  pkg(id: PieId): Writable;
  json(): Transform;
  string(): Transform;
}