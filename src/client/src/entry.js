require('./index.less');

import * as common from './common';

import { VIEW_REPO, VIEW_ORG } from './events';

let names = ['catalog-container', 'catalog-listings']

let init = () => {

  let container = document.querySelector('catalog-container');

  const backendData = Promise.all([
    common.elements.list(),
    common.elements.version()]);

  Promise.all(names)
    .then(() => {
      container.isLoading(true);
      return backendData;
    })
    .then(([list, version]) => {
      customElements.whenDefined('catalog-listings')
        .then(() => {
          let listings = document.querySelector('catalog-listings');
          listings.elements = list.elements;
          console.log('set version to: ', version);
          container.version = version;
          container.isLoading(false);
        });
    });
}

//For now be cautios and dont init on interactive...
if (document.readyState === 'complete' /*|| document.readyState === 'interactive'*/) {
  init();
} else {
  document.onreadystatechange = (e) => {
    if (document.readyState === 'complete') {
      init();
    }
  }
}

document.addEventListener(VIEW_REPO, (e) => {
  console.log('view repo: ', e.detail);
  let { org, repo } = e.detail.element;
  window.location.href = `/element/${org}/${repo}/`;
});

document.addEventListener(VIEW_ORG, (e) => {
  console.log('view repo: ', e.detail);
  let { org, repo } = e.detail.element;
  window.location.href = `/org/${org}/`;
});
