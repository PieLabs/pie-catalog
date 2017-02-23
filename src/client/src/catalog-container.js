const template = document.createElement('template');

template.innerHTML = `
  <catalog-header></catalog-header> 
  <progress-bar disabled></progress-bar>
  <slot></slot>
  <catalog-footer></catalog-footer>
`;

ShadyCSS.prepareTemplate(template, 'catalog-container');

export default class CatalogContainer extends HTMLElement {

  constructor() {
    super();
    ShadyCSS.styleElement(this);

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      let copy = document.importNode(template.content, true);
      this.shadowRoot.appendChild(copy);
    }
  }

  get _progressBar() {
    return this.shadowRoot.querySelector('progress-bar');
  }

  get _content() {
    return this.shadowRoot.querySelector('#content');
  }

  set version(v) {
    this.shadowRoot.querySelector('catalog-footer').version = v;
  }


  isLoading(loading) {
    console.log('isLoading? ', loading);
    if (!this._progressBar) {
      return;
    }

    if (loading) {
      this._progressBar.enable();
      // this._content.setAttribute('loading', '');
    } else {
      this._progressBar.disable();
      // this._content.removeAttribute('loading');
    }
  }
}