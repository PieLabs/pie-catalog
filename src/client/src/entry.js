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

import GithubAvatar from './github-avatar';
customElements.define('github-avatar', GithubAvatar);

import PieBrand from './pie-brand';
customElements.define('pie-brand', PieBrand);

import ProgressBar from './progress-bar';
customElements.define('progress-bar', ProgressBar);

require.ensure([], () => {

  const {define} = require('json-schema-element');
  define();

  const MarkdownElement = require('./markdown-element').default;
  customElements.define('markdown-element', MarkdownElement);

  const CatalogSchemas = require('./schemas').default;
  customElements.define('catalog-schemas', CatalogSchemas);

  const { default: IframeHolder } = require('./iframe-holder');
  customElements.define('iframe-holder', IframeHolder);

  const CatalogEntry = require('./catalog-entry').default;
  customElements.define('catalog-entry', CatalogEntry);

  const { default: DependenciesPanel, DependencyEl } = require('./dependencies-panel');
  customElements.define('dependencies-panel', DependenciesPanel);
  customElements.define('dependency-el', DependencyEl);

  const { default: InfoPanel, GithubInfoCount } = require('./info-panel');
  customElements.define('info-panel', InfoPanel);
  customElements.define('github-info-count', GithubInfoCount);

  //Note: these elements auto register themselves
  require('time-elements');

  const FancyTabs = require('./fancy-tabs').default;
  customElements.define('fancy-tabs', FancyTabs);

}).then(() => {
  let app = document.querySelector('pie-catalog-app');
  app.entryReady();
}).catch((e) => {
  let app = document.querySelector('pie-catalog-app');
  app.error(e);
});


document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('pie-catalog-app')
    .then(() => {

      let app = document.querySelector('pie-catalog-app');
      app.config = window['pie-catalog-app-config'];
      setTimeout(function () {
        app.removeAttribute('hidden');
      }, 150);
    });

});
