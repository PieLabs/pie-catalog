import { prepareTemplate, applyStyle } from './styles';

const templateHTML = `
    <style>
      :host {
        display: block;
        height: 60px;
        min-height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        background-color: var(--catalog-header-bg, rgba(0,50, 49,0.1));
        border-bottom: solid 1px var(--shadow-color, #cccccc);
      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      a{
        font-size: 12px;
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
    <a href="//pielabs.github.io/pie-docs/" target="_blank">PIE FRAMEWORK</a>
    `;


const template = prepareTemplate(templateHTML, 'catalog-header');

export default class CatalogHeader extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, template);
    this._$brand = this.shadowRoot.querySelector('pie-brand');
  }

  connectedCallback() {
    this._$brand.addEventListener('click', e => {
      document.location.pathname = '/';
    });
  }
}

CatalogHeader.TAG_NAME = 'catalog-header';