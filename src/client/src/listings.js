const template = document.createElement('template');
const ShadyCSS = window.ShadyCSS;

template.innerHTML = `
    <style>
        :host {
          display: block;
        }

        .elements > catalog-listing {
          display: inline-block;
          margin: 4px;
          float:left;
        }
    </style>
    <div class="elements">
    </div>
    <div style="clear: both;"></div>
`;

ShadyCSS.prepareTemplate(template, 'catalog-listings');

export default class CatalogListings extends HTMLElement {

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

  set elements(e) {

    this._elements = e;

    if (!this._elements) {
      return;
    }

    let markup = this._elements.map((n, index) => {
      return `<catalog-listing data-index="${index}"></catalog-listing>`;
    });

    this.shadowRoot.querySelector('.elements').innerHTML = markup.join('\n');

    customElements.whenDefined('catalog-listing').then(() => {
      this.shadowRoot.querySelectorAll('catalog-listing').forEach((n, i) => {
        let index = parseInt(n.getAttribute('data-index'));
        n.element = this._elements[index];
      });
    });
  }
}
