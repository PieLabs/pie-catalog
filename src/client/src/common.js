require('./index.less');

console.log('before define function: ', customElements, customElements.define);
let define = (name, prototype) => {
  console.log('in define function: ', customElements, customElements.define);
  if (!('customElements' in window)) {
    throw new Error('customElements isnt defined');
  }

  if (typeof customElements.define !== 'function') {
    console.log(customElements);
    throw new Error('customElements.define is not defined');
  }
  return customElements.define(name, prototype)
}

console.log('before calling define function: ', customElements, customElements.define);
import CatalogListings from './listings';
define('catalog-listings', CatalogListings);

import CatalogListing from './listing';
define('catalog-listing', CatalogListing);

import CatalogHeader from './header';
define('catalog-header', CatalogHeader);

import CatalogFooter from './footer';
define('catalog-footer', CatalogFooter);

import CatalogOrg from './org';
define('catalog-org', CatalogOrg);

import GithubAvatar from './github-avatar';
define('github-avatar', GithubAvatar);

import PieBrand from './pie-brand';
define('pie-brand', PieBrand);

import ProgressBar from './progress-bar';
define('progress-bar', ProgressBar);

import CatalogContainer from './catalog-container';
define('catalog-container', CatalogContainer);

import { elements } from './client';

import AvatarService from './avatar-service';
define('avatar-service', AvatarService);

export { elements };

