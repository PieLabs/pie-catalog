import { prepareTemplate, applyStyle } from './styles';


const templateHTML = `
    <style>
    :host{
      height: 50px;
      padding: 7px;
      display: block;
      background-color: var(--catalog-header-bg, rgba(0,50, 49,0.1));
      border-top: solid 1px var(--shadow-color, #cccccc);
    }

    #version{
      font-size: 11px;
    }

    </style>
    <label id="version"></label> 
`;

const template = prepareTemplate(templateHTML, 'catalog-footer');

export default class CatalogFooter extends HTMLElement {
  constructor() {
    super();
    let sr = applyStyle(this, template);
    this._$version = sr.querySelector('#version');
  }

  set version(v) {
    console.log('version: ', v);
    if (v) {
      this._$version.textContent = v.version;
      if (v.sha && v.sha !== `v${v.version}`) {
        this._$version.textContent += ` : ${v.sha}`;
      }
    }
  }
}