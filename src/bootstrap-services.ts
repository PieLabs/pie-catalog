import { FileBackend, AvatarService, router as getClientRouter } from './client';
import { init } from './log-factory';
import ElementService from './element/mongo-service';
import DemoFileService from './element/demo/file-service';
import DemoS3Service from './element/demo/s3-service';
import { DemoService, DemoRouter } from './element/demo/service';
import { MongoClient, Db } from 'mongodb';
import { buildLogger } from './log-factory';
import { MainGithubService } from './github';
import { join } from 'path';

export type Services = {
  avatar: AvatarService,
  demo: DemoService,
  demoRouter?: DemoRouter,
  element: ElementService,
  onError: () => void
}

const logger = buildLogger();

let getDemoService = async (opts: BootstrapOpts): Promise<DemoService> => {
  if (opts.s3 && opts.s3.bucket && opts.s3.prefix) {
    return await DemoS3Service.build(opts.s3.bucket, opts.s3.prefix);
  } else {
    return new DemoFileService(join(process.cwd(), '.demo-service'));
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
  const demo = await getDemoService(opts);
  const demoRouter = (demo instanceof DemoFileService) ? (demo as DemoRouter) : null;
  const github = new MainGithubService();
  const element = new ElementService(collection, demo, github);
  const avatarBackend = new FileBackend(join(process.cwd(), '.avatar-file-backend'));
  const avatar = new AvatarService(avatarBackend, github);
  const onError = () => db.close();

  return {
    avatar,
    demo,
    demoRouter,
    element,
    onError,
  }
}
