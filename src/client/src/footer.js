const template = document.createElement('template');

template.innerHTML = `
    <style>
    :host{
      padding: 7px;
      display: block;
      background-color: var(--catalog-header-bg, green);
      border-top: solid 1px var(--shadow-color, #cccccc);
    }

    #version{
      font-size: 11px;
    }

    </style>
    <label id="version"></label> 
`;

ShadyCSS.prepareTemplate(template, 'catalog-footer');

export default class CatalogFooter extends HTMLElement {
  constructor() {
    super();

    ShadyCSS.applyStyle(this);

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      let copy = document.importNode(template.content, true);
      this.shadowRoot.appendChild(copy);
    }
    this._$version = this.shadowRoot.querySelector('#version');
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