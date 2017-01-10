#!/usr/bin/env bash

echo "set up a deployment..."

app=$1

echo "app: $app"

rm -fr .deployment 
rm -fr slug.tgz
rm -fr artifact.tgz

mkdir .deployment

read -d '' PROC_FILE << EOL
web: ./node-v7.4.0-linux-x64/bin/node ./lib/index.js
EOL

echo "$PROC_FILE" > .deployment/Procfile

chmod +x .deployment/Procfile
cp -rv node_modules .deployment/node_modules 
cp -rv lib .deployment/lib
cp -rv .file-store .deployment/.file-store


tar -czvf artifact.tgz -C .deployment .

cbt slug-mk-from-artifact-file\
 --artifact-file=artifact.tgz\
 --out-path=slug.tgz \
 --platform=node-7.4.0

cbt slug-deploy-from-file\
 --heroku-app=$app\
 --slug-file=slug.tgz
