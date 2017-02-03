import * as common from './common';

import { VIEW_REPO } from './events';

document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('catalog-container')
    .then(() => {
      document.querySelector('catalog-container').isLoading(true);
      return common.elements.listByOrg(window.pie.org);
    })
    .then((list) => {
      document.querySelector('catalog-org').org = list;
      document.querySelector('catalog-container').isLoading(false);
    });
});

document.addEventListener(VIEW_REPO, (e) => {
  console.log('view repo: ', e.detail);
  let {org, repo} = event.detail.element;
  window.location.href = `/element/${org}/${repo}/`;
});

