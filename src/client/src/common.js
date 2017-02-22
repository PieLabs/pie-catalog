require('./index.less');

let define = (name, prototype) => {
  if (!('customElements' in window)) {
    throw new Error('customElements isnt defined');
  }

  if (typeof customElements.define !== 'function') {
    throw new Error('customElements.define is not defined');
  }
  return customElements.define(name, prototype)
}

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

