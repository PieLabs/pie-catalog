require('./index.less');

import CatalogListings from './listings';
customElements.define('catalog-listings', CatalogListings);

import CatalogListing from './listing';
customElements.define('catalog-listing', CatalogListing);

import CatalogHeader from './header';
customElements.define('catalog-header', CatalogHeader);

import CatalogFooter from './footer';
customElements.define('catalog-footer', CatalogFooter);

import CatalogOrg from './org';
customElements.define('catalog-org', CatalogOrg);

import GithubAvatar from './github-avatar';
customElements.define('github-avatar', GithubAvatar);

import PieBrand from './pie-brand';
customElements.define('pie-brand', PieBrand);

import ProgressBar from './progress-bar';
customElements.define('progress-bar', ProgressBar);

import CatalogContainer from './catalog-container';
customElements.define('catalog-container', CatalogContainer);

import { elements } from './client';

import AvatarService from './avatar-service';
customElements.define('avatar-service', AvatarService);

export { elements };

