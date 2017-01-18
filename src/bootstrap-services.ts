import { FileBackend, AvatarService, router as getClientRouter } from './client';
import { init } from './log-factory';
import ElementService from './element/mongo-service';
import DemoFileService from './element/demo/file-service';
import DemoS3Service from './element/demo/s3-service';
import DemoS3Router from './element/demo/s3-router';
import { DemoService, DemoRouter } from './element/demo/service';
import { MongoClient, Db } from 'mongodb';
import { buildLogger } from './log-factory';
import { MainGithubService } from './github';
import { join } from 'path';

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

    let router = new DemoS3Router(service.client, routerOpts);
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
  // const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pie-catalog';
  logger.info('opts: ', opts);
  const db = await MongoClient.connect(opts.mongoUri);
  const collection = db.collection('elements');
  const {service: demoService, router: demoRouter} = await demoServiceAndRouter(opts);
  const github = new MainGithubService();
  const element = new ElementService(collection, demoService, github);
  const avatarBackend = new FileBackend(join(process.cwd(), '.avatar-file-backend'));
  const avatar = new AvatarService(avatarBackend, github);
  const onError = () => db.close();

  return {
    avatar,
    demoService,
    demoRouter,
    element,
    onError,
  }
}
