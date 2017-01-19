export default class CatalogSchema extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    `;
  }

  set schemas(s) {
    this._schemas = s;

    let jsonString = s.map((v, i) => JSON.stringify(v, null, '  '));

    let jsonString = s.map((v, i) => {
    return `<json-schema 
      data-id="${i}"></json-schema>`;
    });

    this.shadowRoot.querySelector('pre').innerHTML = jsonString.join('\n');

    s.forEach((s, i) => {
      this.shadowRoot.querySelector(`[data-id="${i}"]`).schema = s.schema;
    });
  }
}