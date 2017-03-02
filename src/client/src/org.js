import { VIEW_REPO } from 'pie-catalog-client/src/events';
import { common } from 'pie-catalog-client/src/bootstrap/org';
import { elements } from './client';

let init = () => {

  common
    .then(() => {
      document.querySelector('catalog-container').isLoading(true);
      return elements.listByOrg(window.pie.org);
    })
    .then((list) => {
      customElements.whenDefined('catalog-org')
        .then(() => {
          document.querySelector('catalog-org').org = list;
        });
      document.querySelector('catalog-container').isLoading(false);
    });
};

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
  let { org, repo } = e.detail.element;
  window.location.href = `/element/${org}/${repo}/`;
});

