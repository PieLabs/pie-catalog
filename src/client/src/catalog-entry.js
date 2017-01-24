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
      }

      .header {
        display: flex;
        align-items: bottom;
      }

      #repo, #version {
        font-size: 25px;
        padding-left: 5px;
      }

      #org {
        padding-left: 5px;
        font-size: 19px;
        line-height: 33px;
        cursor:pointer;
        transition: color ease-in 100ms;
        color: rgba(0,0,0,0.8);
        
      }

      #org:hover{
        color: rgba(0,0,0,0.5);
      }

      #demo-holder{
        margin-bottom: 10px;
      }

      .header{
        font-size: 20px;
      }

      hr {
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

      #demo-holder{
        padding-top: 20px;
        min-height: 500px;
        height: 400px;
      }

      
      fancy-tabs{
        margin-top: 10px;
      }
      
      github-avatar{
        padding-left: 6px;
      }


    </style>
    <div class="header">
      <div id="repo"></div>
      <div id="version"></div>
      <div id="org"></div>
      <github-avatar size="30"></github-avatar>
    </div>
    <fancy-tabs>
      <button slot="title">info</button>
      <button slot="title">schemas</button>
      <div>
        <div id="description"></div>
        <iframe-holder id="demo-holder"></iframe-holder>
        <hr/>
        <div id="markdown-holder">
          <markdown-element></markdown-element>
        </div>
        <info-panel></info-panel>
        <dependencies-panel></dependencies-panel>
      </div>
      <div>
        <catalog-schemas></catalog-schemas>
      </div>
      
    </fancy-tabs>
    `;
  }

  connectedCallback() {
    console.log('catalog entry connected');
    console.log('this.element set already?', this.element);
    this._element = this.element;
    this._update();
  }

  set element(e) {
    this._element = e;
    this._update();
  }

  _update() {
    if (!this._element) {
      return;
    }
    let e = this._element;

    this.shadowRoot.querySelector('#repo').textContent = e.repo;
    this.shadowRoot.querySelector('#version').textContent = e.tag;
    this.shadowRoot.querySelector('#org').textContent = `by ${e.org}`;
    this.shadowRoot.querySelector('github-avatar').setAttribute('user', e.org);

    this.shadowRoot.querySelector('#org').addEventListener('click', (e) => {
      this.dispatchEvent(events.viewOrg(this._element));
    });

    customElements.whenDefined('info-panel')
      .then(() => {
        this.shadowRoot.querySelector('info-panel').github = e.github;
      });

    this.shadowRoot.querySelector('markdown-element').markdown = e.readme;

    this.shadowRoot.querySelector('#description').textContent = e.package.description;

    this.shadowRoot.querySelector('catalog-schemas').schemas = e.schemas;

    customElements.whenDefined('dependencies-panel').then(() => {
      this.shadowRoot.querySelector('dependencies-panel').dependencies = e.package.dependencies;
    });

    if (e.demoLink) {
      this.shadowRoot.querySelector('#demo-holder').src = e.demoLink;
    }
  }

}