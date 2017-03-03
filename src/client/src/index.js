import { VIEW_ORG, VIEW_REPO } from 'pie-catalog-client/src/events';

import { common } from 'pie-catalog-client/src/bootstrap/index';
import { elements } from './client';

let init = () => {

  common
    .then(() => {
      let container = document.querySelector('catalog-container');
      container.isLoading(true);
      const backendData = [elements.list(), elements.version()];
      return Promise.all(backendData);
    })
    .then(([list, version]) => {
      let listings = document.querySelector('catalog-listings');
      listings.elements = list.elements;
      const container = document.querySelector('catalog-container');
      container.version = version;
      container.isLoading(false);
    });
}

//For now be cautios and dont init on interactive...
if (document.readyState === 'complete' || document.readyState === 'interactive') {
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
