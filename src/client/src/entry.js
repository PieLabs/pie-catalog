import PieCatalogApp from './pie-catalog-app';
customElements.define('pie-catalog-app', PieCatalogApp);

import {define} from 'json-schema-element';
define();

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

import DependenciesPanel, { DependencyEl } from './dependencies-panel';
customElements.define('dependencies-panel', DependenciesPanel);
customElements.define('dependency-el', DependencyEl);

import InfoPanel, { GithubInfoCount } from './info-panel';
customElements.define('info-panel', InfoPanel);
customElements.define('github-info-count', GithubInfoCount);

//Note: these elements auto register themselves
import timeElements from 'time-elements';

import FancyTabs from './fancy-tabs';
customElements.define('fancy-tabs', FancyTabs);

import CatalogSchemas from './schemas';
customElements.define('catalog-schemas', CatalogSchemas);

document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('pie-catalog-app')
    .then(() => {

      let app = document.querySelector('pie-catalog-app');

      app.config = window['pie-catalog-app-config'];
      setTimeout(function () {
        app.removeAttribute('hidden');
      }, 50);
    });

});
