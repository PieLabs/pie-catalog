export default class CatalogOrg extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <h1 id="org">org</h1>
    <hr/>
    <div id="elements">
    </div>
    `;
  }


  set org(o) {
    this._org = o;

    this.shadowRoot.querySelector('#org').textContent = o.org;

    let markup = o.elements.map((e, i) => {
      return `<catalog-listing data-index="${i}"></catalog-listing>`;
    });

    this.shadowRoot.querySelector('#elements').innerHTML = markup.join('\n');

    this.shadowRoot.querySelectorAll('catalog-listing').forEach((n, i) => {
      let index = parseInt(n.getAttribute('data-index'));
      n.element = o.elements[index];
    });
  }
}