import PieCatalogApp from './pie-catalog-app';
customElements.define('pie-catalog-app', PieCatalogApp);


document.addEventListener('DOMContentLoaded', () => {

  customElements.whenDefined('pie-catalog-app')
    .then(() => {
      document.querySelector('pie-catalog-app').config = {};
    })
})