import { Elements } from './index';
import { Collection } from 'mongodb';

export class MongoElements implements Elements {

  constructor(private collection: Collection) { }

  list() {
    let c = this.collection.find({});
    return c.toArray()
      .then(a => {
        return a;
      })
  }
}