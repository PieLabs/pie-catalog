export default class CatalogSchema extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <pre></pre>
    `;
  }

  set schemas(s) {
    this._schemas = s;

    let jsonString = s.map((v, i) => JSON.stringify(v, null, '  '));

    this.shadowRoot.querySelector('pre').innerHTML = jsonString.join('\n');
  }
}