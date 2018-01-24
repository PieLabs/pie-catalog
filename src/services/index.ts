import MongoService from './element/mongo-service';
import { ElementService } from './element/service';
import DemoFileService from './element/demo/file-service';
import DemoS3Service from './element/demo/s3-service';
import DemoS3Router from './element/demo/s3-router';
import { DemoService, DemoRouter } from './element/demo/service';
import { MongoClient, Db } from 'mongodb';
import { buildLogger } from 'log-factory';
import { MainGithubService } from './github';
import AvatarService, { FileBackend } from './avatar';
import { join } from 'path';
import { PieId } from '../types';
import * as _ from 'lodash';

export { PieId, ElementService, AvatarService }

export type Services = {
  avatar: AvatarService,
  demoService: DemoService,
  demoRouter: DemoRouter,
  element: ElementService,
  onError: () => void
}

const logger = buildLogger();

let demoServiceAndRouter = async (opts: BootstrapOpts): Promise<{ service: DemoService, router: DemoRouter }> => {
  if (opts.s3 && opts.s3.bucket && opts.s3.prefix) {
    let service = await DemoS3Service.build(opts.s3.bucket, opts.s3.prefix);

    let routerOpts = {
      bucket: opts.s3.bucket,
      prefix: service.servicePrefix
    }
    let router = await DemoS3Router.build(service.client, routerOpts);
    return { service, router };
  } else {
    let service = new DemoFileService(join(process.cwd(), '.demo-service'));
    return { service, router: service }
  }
}

type BootstrapOpts = {
  s3?: {
    bucket: string,
    prefix: string
  },
  mongoUri: string
}

export function buildOpts(args: any, env: any): BootstrapOpts {
  let s3 = {
    bucket: args.bucket || env['S3_BUCKET'],
    prefix: args.prefix || env['S3_PREFIX']
  }

  let mongoUri = args.mongoUri || env['MONGO_URI'] || 'mongodb://localhost:27017/pie-catalog'
  return {
    s3,
    mongoUri
  }
}

export async function bootstrap(opts: BootstrapOpts): Promise<Services> {
  logger.info('opts: ', opts);
  MongoClient
  const client = await MongoClient.connect(opts.mongoUri);
  const dbName = _.last(opts.mongoUri.split('/'));
  const db = client.db(dbName);
  const collection = db.collection('elements');
  const { service: demoService, router: demoRouter } = await demoServiceAndRouter(opts);
  const github = new MainGithubService();
  const element = new MongoService(collection, demoService, github);
  const avatarBackend = new FileBackend(join(process.cwd(), '.avatar-file-backend'));
  const avatar = new AvatarService(avatarBackend, github);
  const onError = () => client.close();

  return {
    avatar,
    demoService,
    demoRouter,
    element,
    onError,
  }
}
