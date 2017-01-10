import PieId from '../types/pie-id';
import { Readable, Writable, Transform } from 'stream';
import FileStore, { DemoRouter } from './backends/demo/file'
import MongoElementStreamer from './backends/element/mongo';
import DefaultStreamer from './backends/default';

export {
  Readable,
  Writable,
  PieId,
  FileStore,
  DemoRouter,
  MongoElementStreamer,
  DefaultStreamer
}

export interface DemoFileStreamer {
  demoFile(id: PieId, name: string): Writable;
}

export interface ElementStreamer {
  schema(id: PieId, name: string): Writable;
  readme(id: PieId): Writable;
  pkg(id: PieId): Writable;
  json(): Transform;
  string(): Transform;
}

export interface Streamer extends DemoFileStreamer, ElementStreamer { }