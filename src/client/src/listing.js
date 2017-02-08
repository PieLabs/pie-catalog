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
        height: 120px;
        max-height: 120px;
        display: block;
        cursor: pointer;
        padding: 10px;
        background-color: white;
        box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.2);
        transition: box-shadow 200ms ease-in;
      }

      :host(:hover){
        cursor: pointer;
        box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.4);
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

      #repo{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      #tag{
        font-size: 12px;
        margin-top: 4px;
        margin-bottom: 4px;
      }

    </style>

    <h4 id="repo"></h4>
    <div id="tag"></div>
    <span id="description"></span>
    <hr/>
    <div class="footer">
      <github-avatar size="40"></github-avatar>
      <label id="org"></label>
    </div>
    `;

    this._$org = this.shadowRoot.querySelector('#org');
    this._$repo = this.shadowRoot.querySelector('#repo');
    this._$tag = this.shadowRoot.querySelector('#tag');
    this._$description = this.shadowRoot.querySelector('#description');
    this._$avatar = this.shadowRoot.querySelector('github-avatar');
  }

  set element(e) {
    this._element = e;
    let qs = this.shadowRoot.querySelector;
    this._$org.textContent = e.org;
    this._$repo.textContent = e.repo;
    this._$tag.textContent = e.tag;
    this._$description.textContent = e.description;
    this._$avatar.setAttribute('user', e.org);
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
