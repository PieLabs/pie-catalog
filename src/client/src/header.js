import { prepareTemplate, applyStyle } from './styles';

const templateHTML = `
    <style>
      :host {
        display: block;
        height: 60px;
        min-height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        background-color: var(--catalog-header-bg, green);
        border-bottom: solid 1px var(--shadow-color, #cccccc);
      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      a{
        font-size: 14px;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--pie-brand-color, #333333);
        transition: color 100ms linear;
        margin-right: 10px;
      }
      
      a:hover{
        color: var(--pie-brand-hover-color, #300333);
      }

      pie-brand{
        margin-right: 10px;
      }


    </style>
    <pie-brand></pie-brand>
    <a href="//pielabs.github.io/pie-docs/" target="_blank">Documentation</a>
    `;


// const template = prepareTemplate(templateHTML, 'catalog-header');

export default class CatalogHeader extends HTMLElement {

  constructor() {
    super();
    const template = prepareTemplate(templateHTML, CatalogHeader.TAG_NAME);
    let sr = applyStyle(this, template);
    console.log('sr: ', sr);
    this._$brand = this.shadowRoot.querySelector('pie-brand');
  }

  connectedCallback() {
    this._$brand.addEventListener('click', e => {
      document.location.pathname = '/';
    });
  }
}

CatalogHeader.TAG_NAME = 'catalog-header';