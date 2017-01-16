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
      }

      iframe{
        width: 100%;
        height: 500px;
        background-color: white;
        box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }
      
      fancy-tabs{
        margin-top: 10px;
      }

    </style>
    <div class="header">
      <div id="repo"></div>
      <div id="version"></div>
      <div id="org"></div>
    </div>
    <fancy-tabs>
      <button slot="title">info</button>
      <button slot="title">schemas</button>
      <section>
        <div id="description"></div>
        <info-panel></info-panel>
        <dependencies-panel></dependencies-panel>
        <div id="demo-holder"></div>
        <div class="header">README.md</div>
        <div id="markdown-holder">
          <markdown-element></markdown-element>
        </div>
      </section>
      <section>
        <catalog-schemas></catalog-schemas>
      </section>
      
    </fancy-tabs>
    `;
  }

  connectedCallback() {
    console.log('catalog entry connected');
  }

  set element(e) {
    this._element = e;

    this.shadowRoot.querySelector('#repo').textContent = e.repo;
    this.shadowRoot.querySelector('#version').textContent = e.tag;
    this.shadowRoot.querySelector('#org').textContent = `by ${e.org}`;
    this.shadowRoot.querySelector('#org').addEventListener('click', (e) => {
      this.dispatchEvent(events.viewOrg(this._element));
    });

    this.shadowRoot.querySelector('info-panel').github = e.github;

    this.shadowRoot.querySelector('markdown-element').markdown = e.readme;

    this.shadowRoot.querySelector('#description').textContent = e.package.description;

    this.shadowRoot.querySelector('catalog-schemas').schemas = e.schemas;

    this.shadowRoot.querySelector('dependencies-panel').dependencies = e.package.dependencies;

    if (e.demoLink) {
      this.shadowRoot.querySelector('#demo-holder').innerHTML = `
     <iframe src="${e.demoLink}" frameborder="0"></iframe>
    `
    }
  }
}