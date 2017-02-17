const template = document.createElement('template');

template.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;

        }

        progress-bar{
          height: 2px;
        }

        [loading] {
          opacity: 0;
        }
                
        #content { 
          position: relative;
          flex-grow: 1;
          transition: opacity 300ms linear;
          padding: 10px;
        } 
      </style>
      <catalog-header></catalog-header> 
      <progress-bar disabled></progress-bar>
      <div id="content">
        <slot></slot>
      </div>
      <catalog-footer></catalog-footer>
`;

ShadyCSS.prepareTemplate(template, 'catalog-container');

export default class CatalogContainer extends HTMLElement {

  constructor() {
    super();
    ShadyCSS.applyStyle(this);

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      let copy = document.importNode(template.content, true);
      console.log('copy: ', copy);
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
      this._content.setAttribute('loading', '');
    } else {
      this._progressBar.disable();
      this._content.removeAttribute('loading');
    }
  }
}