export default class CatalogListings extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
        :host {
          display: block;
          background-color:#eeeeee;
          padding: 10px;
          margin: 10px;
        }

        .elements{
          display: block;
        }

        .elements > catalog-listing {
          display: inline-block;
          margin: 4px;
        }
    </style>
    <div class="elements">
    </div>
    `;
  }

  connectedCallback() {
    console.log('connected');
  }

  set elements(e) {
    this._elements = e;
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
