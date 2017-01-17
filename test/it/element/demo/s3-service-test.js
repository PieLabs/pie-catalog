const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
AWS.config.logger = {
  log: function (msg) {
    //console.log(msg);
  }
}
const _ = require('lodash');
const fs = require('fs-extra');
const s3 = new AWS.S3();
const Service = require('../../../../lib/element/demo/s3-service').default;
const chai = require('chai');
const path = require('path');

require('../../../../lib/log-factory').init('silly');

describe('s3-service', () => {
  let service;
  let prefix = 'integration-test/.demo-service';

  before(() => {
    return Service.build('pie-catalog', prefix)
      .then(s => {
        service = s;
      });
  });

  describe('build', () => {

    it('should throw an error if the bucket doesnt exist', () => {
      return Service.build('a-bucket-that-doesnt-exist')
        .then(() => {
          throw new Error('should have failed')
        })
        .catch(e => { });
    });
  });

  describe('upload', () => {

    let testImage = 'img.jpg';
    let key = `${prefix}/org/repo/1.0.0/${testImage}`;
    let headResult, headErr;

    after((done) => {
      s3.deleteObject({ Bucket: 'pie-catalog', Key: key }, err => {
        console.log('deleted: ', key);
        done(err);
      });
    });

    before((done) => {
      new Promise((resolve, reject) => {
        let file = path.join(__dirname, testImage);
        let filesize = fs.statSync(file).size;
        let id = { org: 'org', repo: 'repo', tag: '1.0.0' };
        let rs = fs.createReadStream(file);
        service.upload(id, testImage, rs, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
        .then(() => {
          s3.headObject({ Bucket: 'pie-catalog', Key: key }, (err, o) => {
            headResult = o;
            headErr = err;
            done();
          });
        })
        .catch(e => done(e));

    });

    it('headObject on uploaded asset is null', () => {
      chai.expect(headErr).to.be.null;
    });

    it('returns a content type of image/jpeg', () => {
      chai.expect(headResult.ContentType).to.eql('image/jpeg');
    });

  });

  describe('delete', () => {

    let params;

    before((done) => {
      params = {
        Bucket: 'pie-catalog',
        Key: `${prefix}/org/repo/1.0.0/test.txt`,
      }

      s3.putObject(_.extend({}, params, { Body: 'hi' }), done);
    });

    it('should delete all assets', function (done) {
      this.timeout(3000);
      service.delete({ org: 'org', repo: 'repo', tag: '1.0.0' }, 'test.txt')
        .then(r => {
          s3.headObject(params, (err) => {
            console.log('got err: ', err);
            chai.expect(err).not.to.be.null;
            done();
          });
        });
    });
  });
});