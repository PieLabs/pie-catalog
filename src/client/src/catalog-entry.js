import * as events from './events';

export default class CatalogEntry extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    <style>

      :host {
        display: block;
        position:relative;
        padding-top:20px;
      }

      .header {
        display: flex;
        align-items: bottom;
      }

      #repo, #version {
        font-size: 18px;
        padding-left: 5px;
      }

      #org {
        padding-left: 15px;
        font-size: 14px;
        line-height: 25px;
        cursor: pointer;
        transition: color ease-in 100ms;
        color: rgba(0,0,0,0.8);        
      }

      #org:hover{
        color: rgba(0,0,0,0.5);
      }

      #demo-holder{
        margin-bottom: 0px;
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

      <button slot="title">demo</button>
      <div>
        <div id="demo-holder">
          <slot></slot>
        </div>
      </div>

      <button id="schemas-button" slot="title">readme</button> 
      <div>
        <div id="description"></div>
        <div id="markdown-holder">
          <markdown-element></markdown-element>
        </div>
        <info-panel></info-panel>
        <dependencies-panel></dependencies-panel>
      </div>
      
    </fancy-tabs>
    `;
  }

  connectedCallback() {
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
    this.shadowRoot.querySelector('#org').textContent = `${e.org}`;
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


    customElements.whenDefined('dependencies-panel').then(() => {
      this.shadowRoot.querySelector('dependencies-panel').dependencies = e.package.dependencies;
    });

  }

}