export default class CatalogSchema extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    `;
  }

  set schemas(s) {

    console.log('[schemas] set....');
    this._schemas = s;
    this.update();
  }

  update() {

    if (!this._schemas) {
      return;
    }

    let s = this._schemas;

    let jsonString = s.map((v, i) => {
      return `<json-schema 
      data-id="${i}"></json-schema>`;
    });

    this.shadowRoot.innerHTML = jsonString.join('\n');

    s.forEach((s, i) => {
      this.shadowRoot.querySelector(`[data-id="${i}"]`).schema = s.schema;
    });
  }


  connectedCallback() {
    if (this.schemas) {
      this._schemas = this.schemas;
      this.update();
    }
  }
}