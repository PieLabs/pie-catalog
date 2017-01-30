require('./index.less');

import * as common from './common';

import { VIEW_REPO, VIEW_ORG } from './events';

document.addEventListener('DOMContentLoaded', () => {

  customElements.whenDefined('catalog-container')
    .then(() => {
      document.querySelector('catalog-container').isLoading(true);
      return common.elements.list();
    })
    .then((list) => {
      let listings = document.querySelector('catalog-listings');
      listings.elements = list.elements;
      document.querySelector('catalog-container').isLoading(false);
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
