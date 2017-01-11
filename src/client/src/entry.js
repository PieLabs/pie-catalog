import PieCatalogApp from './pie-catalog-app';
customElements.define('pie-catalog-app', PieCatalogApp);

import CatalogListings from './listings';
customElements.define('catalog-listings', CatalogListings);

import CatalogListing from './listing';
customElements.define('catalog-listing', CatalogListing);

import CatalogHeader from './header';
customElements.define('catalog-header', CatalogHeader);

import CatalogOrg from './org';
customElements.define('catalog-org', CatalogOrg);

import CatalogEntry from './catalog-entry';
customElements.define('catalog-entry', CatalogEntry);

import GithubAvatar from './github-avatar';
customElements.define('github-avatar', GithubAvatar);

import MarkdownElement from './markdown-element';
customElements.define('markdown-element', MarkdownElement);

import InfoPanel from './info-panel';
customElements.define('info-panel', InfoPanel);

import FancyTabs from './fancy-tabs';
customElements.define('fancy-tabs', FancyTabs);

import CatalogSchemas from './schemas';
customElements.define('catalog-schemas', CatalogSchemas);

document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('pie-catalog-app')
    .then(() => {
      setTimeout(function () {
        document.querySelector('pie-catalog-app').removeAttribute('hidden');
      }, 0);
    });

});
