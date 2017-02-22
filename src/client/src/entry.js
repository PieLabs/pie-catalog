require('./index.less');

import * as common from './common';

import { VIEW_REPO, VIEW_ORG } from './events';

let init = () => {

  let container = document.querySelector('catalog-container');

  const backendData = Promise.all([
    common.elements.list(),
    common.elements.version()]);

  customElements.whenDefined('catalog-container')
    .then(() => {
      console.log('catalog-container is defined...');
      container.isLoading(true);
      return backendData;
    })
    .then(([list, version]) => {
      console.log('list: ', list, 'version: ', version);
      let listings = document.querySelector('catalog-listings');
      listings.elements = list.elements;
      console.log('set version to: ', version);
      container.version = version;
      container.isLoading(false);
    });
}

if (document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

document.addEventListener(VIEW_REPO, (e) => {
  console.log('view repo: ', e.detail);
  let { org, repo } = event.detail.element;
  window.location.href = `/element/${org}/${repo}/`;
});

document.addEventListener(VIEW_ORG, (e) => {
  console.log('view repo: ', e.detail);
  let { org, repo } = event.detail.element;
  window.location.href = `/org/${org}/`;
});
