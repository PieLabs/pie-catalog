import * as common from './common';

import { VIEW_REPO } from './events';

let init = () => {
  customElements.whenDefined('catalog-container')
    .then(() => {
      document.querySelector('catalog-container').isLoading(true);
      return common.elements.listByOrg(window.pie.org);
    })
    .then((list) => {
      customElements.whenDefined('catalog-org')
        .then(() => {
          document.querySelector('catalog-org').org = list;
        });
      document.querySelector('catalog-container').isLoading(false);
    });
};

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
  let {org, repo} = e.detail.element;
  window.location.href = `/element/${org}/${repo}/`;
});

