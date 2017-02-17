console.log('0000000000000000000000 ENTRY.JS');

// require('./index.less');

console.log('before import: ', customElements);
import * as common from './common';
import CatalogContainer from './catalog-container';
import CatalogListings from './listings';
import CatalogListing from './listing';
import AvatarService from './avatar-service';
import CatalogFooter from './footer';
import GithubAvatar from './github-avatar';
import CatalogHeader from './header';
import PieBrand from './pie-brand';
import ProgressBar from './progress-bar';

// import { VIEW_REPO, VIEW_ORG } from './events';
// import CatalogContainer from './catalog-container';
// class CatalogContainer extends HTMLElement {
//   constructor() {
//     super();
//     let sr = this.attachShadow({ mode: 'open' });
//     sr.innerHTML = `hi!!!`;
//   }
// }

customElements.define('progress-bar', ProgressBar);
customElements.define('pie-brand', PieBrand);
customElements.define('catalog-header', CatalogHeader);
customElements.define('github-avatar', GithubAvatar);
customElements.define('catalog-container', CatalogContainer);
customElements.define('catalog-footer', CatalogFooter);
customElements.define('catalog-listings', CatalogListings);
customElements.define('catalog-listing', CatalogListing);
customElements.define('avatar-service', AvatarService);

let init = () => {
  console.log('DOMContentLoaded!');

  let container = document.querySelector('catalog-container');

  customElements.whenDefined('catalog-container')
    .then(() => {
      console.log('catalog-container is defined...');
      container.isLoading(true);
      return Promise.all([common.elements.list(), common.elements.version()]);
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

if (window._domContentLoaded) {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

// document.addEventListener(VIEW_REPO, (e) => {
//   console.log('view repo: ', e.detail);
//   let {org, repo} = event.detail.element;
//   window.location.href = `/element/${org}/${repo}/`;
// });

// document.addEventListener(VIEW_ORG, (e) => {
//   console.log('view repo: ', e.detail);
//   let {org, repo} = event.detail.element;
//   window.location.href = `/org/${org}/`;
// });
