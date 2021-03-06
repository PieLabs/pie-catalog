import { defineRepoElements } from 'pie-catalog-client';
import { elements } from './client';

/**
 * -- A note on tree shaking --
 * Insead of the import below locating the module it needs it'd 
 * be preferable to go: 
 * <code>
 *   import {repo} from 'pie-catalog-client';
 *   //or
 *   import {bootstrap} from 'pie-catalog-client';
 *   bootstrap.repo(); //only pull in `repo` function please.
 * </code>
 * however tree shaking we webpack 2 depends on uglifyjs.
 * uglifyjs doesnt support many of the language features we want like arrow functions and classes etc.
 * Until this is all sorted we're going to have to import files directly.
 * @see https://github.com/webpack/webpack/issues/2867 
 */

let init = () => {

  let info = elements.load(window.pie.name);
  let elementNames = Object.keys(window.demo.config.elements);
  let demoElements = Promise.all(elementNames.map(el => customElements.whenDefined(el)));

  defineRepoElements().then(() => {
    const container = document.querySelector('catalog-container');
    container.isLoading(true);
  });

  Promise.all([info, demoElements])
    .then(([infoResult, els]) => {
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

      demo.configureMap = window.demo.configureMap;

      setTimeout(() => {
        const container = document.querySelector('catalog-container');
        container.isLoading(false);
      }, 180);
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

