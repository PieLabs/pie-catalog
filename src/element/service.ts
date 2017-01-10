import PieId from '../types/pie-id';
import { Writable } from 'stream';

export interface DemoService {
  stream(id: PieId, name: string): Writable;
}

export interface ElementService {

  create(data: ElementData): Promise<any>;

  get demo(): DemoService;
}