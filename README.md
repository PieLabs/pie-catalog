# pie-catalog

## install 
```
npm install 
```

### dependencies

* mongodb
* s3/cloudfront

## run 

```shell
npm run dev # runs a dev server with change detection
```

## test 

TODO...

```shell
npm test
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
