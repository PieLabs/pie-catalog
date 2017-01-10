import * as events from './events';

export default class CatalogEntry extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    <style>

      :host {
        display: block;
        padding: 10px;
        position:relative;
        background-color: var(--shadow-color, hsla(0,0%, 0%, 0.1));
      }

      .header {
        display: flex;
        align-items: bottom;
      }

      #repo, #version {
        font-weight: bold;
        font-size: 19px;
        padding-left: 5px;
      }

      #version{
        color: grey;
      }

      #org {
        padding-left: 5px;
        color: #cccccc;
        font-style: italic;
        font-size: 19px;
      }

      hr {
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

      #demo-holder{
        padding-top: 20px;
      }

      iframe{
        width: 100%;
        height: 400px;
        background-color: white;
        box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

    </style>
    <div class="header">
      <div id="repo"></div>
      <div id="version"></div>
      <div id="org"></div>
    </div>
    <hr/>
    <div id="description"></div>
    <div id="demo-holder"></demo>
    `;
  }

  connectedCallback() {
    console.log('catalog entry connected');
  }

  set element(e) {
    this._element = e;

    this.shadowRoot.querySelector('#repo').textContent = e.repo;
    this.shadowRoot.querySelector('#version').textContent = e.version;
    this.shadowRoot.querySelector('#org').textContent = `by ${e.org}`;
    this.shadowRoot.querySelector('#org').addEventListener('click', (e) => {
      this.dispatchEvent(events.viewOrg(this._element));
    });

    this.shadowRoot.querySelector('#description').textContent = e.description;

    this.shadowRoot.querySelector('#demo-holder').innerHTML = `
     <iframe src="${e.demoLink}" frameborder="0"></iframe>
    `
  }
}