require('./index.less');

import * as common from './common';

import { VIEW_REPO, VIEW_ORG } from './events';

document.addEventListener('DOMContentLoaded', () => {

  let container = document.querySelector('catalog-container');

  customElements.whenDefined('catalog-container')
    .then(() => {
      container.isLoading(true);
      return Promise.all([common.elements.list(), common.elements.version()]);
    })
    .then(([list, version]) => {
      let listings = document.querySelector('catalog-listings');
      listings.elements = list.elements;
      console.log('set version to: ', version);
      container.version = version;
      container.isLoading(false);
    });
});

document.addEventListener(VIEW_REPO, (e) => {
  console.log('view repo: ', e.detail);
  let {org, repo} = event.detail.element;
  window.location.href = `/element/${org}/${repo}/`;
});

document.addEventListener(VIEW_ORG, (e) => {
  console.log('view repo: ', e.detail);
  let {org, repo} = event.detail.element;
  window.location.href = `/org/${org}/`;
});
