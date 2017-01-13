# PIE Catalog

The app that shows a catalog of pie elements.

There are a few elements to it.

* builder - a service that builds pie demo items and sends a tarball to store.
* client + store - a web app that renders the demo items using store.

For starters we'll just set up the client and store, and do the building ourselves.


## builder 

> Note: this will be punted on for now but worth describing the mechanics.

`POST /build/:owner/:repo/:version` - build a repo 

* clone the repo
* run `pie info` or `pie pack -a catalog --createArchive` 
  * will add some webpack `externals` that it knows the app doesn't need etc.
  * create an archive of the generated assets (includes the `public` dir plus whatever else the catalog app decides is needed.)
* send archive to the `store`

## client + store

A website that contains the elements and their groupings, and allows assets to be stored.

### client 

> Note: for now the elements and their groupings will be hardcoded into the app. We'll update that later such that the elements and groupings are defined externally.

> Note: We may consider doing an single page app for this.

`GET /` - the index page
`GET /:grouping` - a grouping index page 
`GET /:grouping/:element` - an element page
`POST /search` - search by element/grouping name - for a later stage.

### store 

A store of an element's built assets + metadata.

`POST /ingest` - ingest a tarball

* untars the archive 
* puts the file assets to an accessible location `/:owner/:repo/:version/:path-to-asset`. (eg: s3/cloudfront)
* stores the metadata

* How to know the version of the element - for asset retrieval?

`GET /:grouping.json` - get the grouping info
`GET /:grouping/:element.json` - get the element info
`GET /:grouping/:element/demo/index.html` - the demo page (to be loaded into an iframe).
`GET /:grouping/:element/demo/pie.js` - the pie
`GET /:grouping/:element/demo/:path` - return any static asset used by the demo 



### TODO

```javascript

  service.update(org, repo, tag, {});
  service.find({latest: true, org: });
  service.findOne();
  service.listVersions(org, repo);

```


```javascript

{ 
  org: 'org',
  repo: 'repo',
  tag: '2.0.0', //only release versions allowed.
  latest: true,
  tags: [
    '1.0.0',
    '2.0.0'
  ],
  readme: '',
  schemas: [],
  package: {}
}

{
  version: '1.0.0'
}
```