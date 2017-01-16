import * as events from './events';
import * as styles from './styles';

export default class CatalogListing extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

    <style>
     :host{
        width: 300px;
        height: 100px;
        max-height: 100px;
        display: block;
        cursor: pointer;
        padding: 10px;
        background-color: white;
        ${styles.boxShadow}
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
        display: block;
        font-size: 14px;
        height: 20px;
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
      <github-avatar></github-avatar>
      <label id="org"></label>
    </div>
    `;
  }

  set element(e) {
    this._element = e;
    this.shadowRoot.querySelector('#org').textContent = e.org;
    this.shadowRoot.querySelector('#repo').textContent = `${e.repo} - ${e.tag}`;
    this.shadowRoot.querySelector('#description').textContent = e.description;
    this.shadowRoot.querySelector('github-avatar').setAttribute('user', e.org);
  }

  get element() {
    return this._element;
  }

  connectedCallback() {
    let onRepoClick = (e) => {
      e.preventDefault();
      this.dispatchEvent(events.viewRepo(this._element));
    };

    let onOrgClick = (e) => {
      e.preventDefault();
      this.dispatchEvent(events.viewOrg(this._element));
    };

    this.shadowRoot.querySelector('#repo').addEventListener('click', onRepoClick);
    this.shadowRoot.querySelector('#description').addEventListener('click', onRepoClick);
    this.shadowRoot.querySelector('#org').addEventListener('click', onOrgClick);
  }

}
