# pie-catalog

## install 
```
npm install 
```

### backend dependencies

* mongodb
* s3/cloudfront

## run 

To run a dev server with a local mongo and the filesystem as the asset server run:
```shell
npm run dev # runs a dev server with change detection
```

To run prod: 
```shell
gulp build
node lib/index.js #add params here or have the env vars set.
```
### app params

| param | env-var  | default  | description |
|-------|----------|----------|-------------|
| `--bucket`  | `S3_BUCKET` | undefined  | set the bucket name - the bucket must exist and be publicly accessible |
|`--prefix` | `S3_PREFIX` | 'app' | set the prefix for the app. All assets will be stored under this prefx within the given bucket. | 
|`--mongoUri` | `MONGO_URI` | mongodb://localhost:27017/pie-catalog  | the mongo uri |


* if `--bucket` isn't defined the app uses the local file system as the storage system for assets.


## test 

TODO...

```shell
npm test
```

## debug 

```shell 
./node_modules/.bin/ts-node --debug-brk src/index.ts
```

## deploying a preview version

To deploy a preview version of the app for others to look at run: 

```
gulp build
./deploy $name_of_heroku_app
```

You'll have to have the following set up on that heroku app: 

* `MONGO_URI` - a mongo uri to connect to.

This app uses the mongo db + a local `.file-store` so you'll need to have called `ingest` with a pie archive for this to run.
