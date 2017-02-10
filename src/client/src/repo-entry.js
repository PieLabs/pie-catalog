require('./index.less');

import * as common from './common';

import { VIEW_ORG } from './events'

let logic = require.ensure([], () => {

  const {define} = require('json-schema-element');
  define();

  //load up the select field
  require('material-elements/src/select-field');

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

  const { default: CatalogDemo } = require('./catalog-demo');
  customElements.define('catalog-demo', CatalogDemo);
  const {default: ControlPanel} = require('./catalog-demo/control-panel');
  customElements.define('control-panel', ControlPanel);
});


document.addEventListener('DOMContentLoaded', () => {

  let info = common.elements.load(window.pie.org, window.pie.repo);

  /** init loader */

  let container = document.querySelector('catalog-container');

  customElements.whenDefined('catalog-container')
    .then(() => {
      container.isLoading(true);
    });

  let elementNames = ['catalog-demo'].concat(Object.keys(window.demo.config.elements));
  let demoElements = elementNames.map(el => customElements.whenDefined(el));
  let allPromises = [logic, info].concat(demoElements);

  Promise.all(allPromises)
    .then(([logic, infoResult]) => {
      let entry = document.querySelector('catalog-entry');
      entry.element = infoResult;
      entry.config = window.pie.config;

      if (!window.demo.config) {
        throw new Error('config is missing');
      }
      if (!window.controllers) {
        throw new Error('controllers is missing');
      }
      let demo = document.querySelector('catalog-demo');
      demo.config = window.demo.config;
      demo.controllers = window.controllers;
      demo.markup = window.demo.markup;
      setTimeout(() => {
        container.isLoading(false);
      }, 180)
    })
});


document.addEventListener(VIEW_ORG, (e) => {
  let org = event.detail.element.org;
  window.location.href = `/org/${org}/`;
});
