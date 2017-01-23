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

console.log('load entry chunk...');

var o = require.ensure([], () => {
  
  const {define} = require( 'json-schema-element');
  define();

  const MarkdownElement = require('./markdown-element').default;
  customElements.define('markdown-element', MarkdownElement);

  const CatalogEntry = require('./catalog-entry').default;
  customElements.define('catalog-entry', CatalogEntry);
  const { default: DependenciesPanel, DependencyEl } = require('./dependencies-panel');
  customElements.define('dependencies-panel', DependenciesPanel);
  customElements.define('dependency-el', DependencyEl);

  const { default: InfoPanel, GithubInfoCount } = require( './info-panel');
  customElements.define('info-panel', InfoPanel);
  customElements.define('github-info-count', GithubInfoCount);

  //Note: these elements auto register themselves
  require('time-elements');

  const FancyTabs = require( './fancy-tabs').default;
  customElements.define('fancy-tabs', FancyTabs);

  const CatalogSchemas = require( './schemas').default;
  customElements.define('catalog-schemas', CatalogSchemas);

  document.dispatchEvent(new CustomEvent('entry-chunk-loaded'));
});
console.log('o: ', o); 
o.then(function(){
  console.log('o.value: ', arguments);
})
document.addEventListener('entry-chunk-loaded', () => {
  console.log('entry chunk loaded!');
});
import GithubAvatar from './github-avatar';
customElements.define('github-avatar', GithubAvatar);



import PieBrand from './pie-brand';
customElements.define('pie-brand', PieBrand);

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
