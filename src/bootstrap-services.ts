import { FileBackend, AvatarService, router as getClientRouter } from './client';
import { init } from './log-factory';
import ElementService from './element/mongo-service';
import DemoService from './element/demo/file-service';
import { DemoRouter } from './element/demo/service';
import { MongoClient, Db } from 'mongodb';
import { buildLogger, getLogger } from './log-factory';
import { MainGithubService } from './github';
import { join } from 'path';

export type Services = {
  avatar: AvatarService,
  demo: DemoRouter & DemoService,
  element: ElementService,
  onError: () => void
}

const logger = getLogger('APP');

export function bootstrap(): Promise<Services> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pie-catalog';
  logger.info('mongoUri:', mongoUri);
  return MongoClient.connect(mongoUri)
    .then((db) => {
      const collection = db.collection('elements');
      const demo = new DemoService(join(process.cwd(), '.demo-service'));
      const github = new MainGithubService();
      const element = new ElementService(collection, demo, github);
      const avatarBackend = new FileBackend(join(process.cwd(), '.avatar-file-backend'));
      const avatar = new AvatarService(avatarBackend, github);
      const onError = () => db.close();
      return { avatar, demo, element, onError }
    })
    .catch(e => {
      throw new Error('bootstrap failed');
    });
}
