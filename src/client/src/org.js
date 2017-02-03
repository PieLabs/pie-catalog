export default class CatalogOrg extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

    <style>

      :host{
        display: block;
      }
      .elements > catalog-listing {
        display: inline-block;
        margin: 4px;
      }

      hr{
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      } 

    </style>
    <div id="org"></div>
    <hr/>
    <div class="elements">
    </div>
    `;
  }


  set org(o) {
    this._org = o;

    this.shadowRoot.querySelector('#org').textContent = o.org;

    let markup = o.elements.map((e, i) => {
      return `<catalog-listing data-index="${i}"></catalog-listing>`;
    });

    this.shadowRoot.querySelector('.elements').innerHTML = markup.join('\n');

    this.shadowRoot.querySelectorAll('catalog-listing').forEach((n, i) => {
      let index = parseInt(n.getAttribute('data-index'));
      n.element = o.elements[index];
    });
  }
}