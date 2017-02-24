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

//For now be cautios and dont init on interactive...
if (document.readyState === 'complete' /*|| document.readyState === 'interactive'*/) {
  init();
} else {
  document.onreadystatechange = (e) => {
    console.log('readystatechange: ', e, document.readyState);
    if (document.readyState === 'complete') {
      init();
    }
  }
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
