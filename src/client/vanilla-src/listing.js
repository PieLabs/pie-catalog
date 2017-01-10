export default class CatalogListing extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

    <style>
     :host{
        width: 300px;
        display: block;
        cursor: pointer;
        padding: 10px;
        background-color: white;
        box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }
      

      h4 {
        padding: 0;
        margin: 0;
      }

      hr {
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

      #description {
        font-size: 14px;
      }

      .footer{
        display: flex;
        align-items: center;
        padding: 2px;
      }
      #org{
        padding: 6px;
      }
    </style>

    <h4 id="repo"></h4>
    <span id="description"></span>
    <hr/>
    <div class="footer">
      <img src="https://avatars.githubusercontent.com/u/23503597?v=3&s=40"></img> 
      <label id="org"></label>
    </div>
    `;
  }

  set element(e) {
    this._element = e;
    this.shadowRoot.querySelector('#org').textContent = e.org;
    this.shadowRoot.querySelector('#repo').textContent = e.repo;
    this.shadowRoot.querySelector('#description').textContent = e.description;
  }

  get element() {
    return this._element;
  }

  connectedCallback() {
    console.log('connected');

    // this.shadowRoot.querySelector('.root').addEventListener('click', () => {
    //   console.log('listing clicked');
    // })
  }

}
