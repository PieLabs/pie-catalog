import * as client from 'pie-catalog-client';

const { ELEMENT_CLICK } = client.events;

import { elements } from './client';

let init = () => {

  client.defineCommonElements()
    .then(() => {
      let container = document.querySelector('catalog-container');
      container.isLoading(true);
      const backendData = [elements.list(), elements.version()];
      return Promise.all(backendData);
    })
    .then(([list, version]) => {
      let listings = document.querySelector('catalog-listings');
      //TODO: shouldn't have to map
      listings.elements = list.elements;
      const container = document.querySelector('catalog-container');
      container.version = version;
      container.isLoading(false);
    });
}

//For now be cautios and dont init on interactive...
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.onreadystatechange = (e) => {
    if (document.readyState === 'complete') {
      init();
    }
  }
}

document.addEventListener(ELEMENT_CLICK, (e) => {
  console.log('view repo: ', e.detail);
  let { name } = e.detail.element;
  window.location.href = `/element/${name}`;
});

