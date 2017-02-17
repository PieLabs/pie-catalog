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

      #repo {
        font-size: 28px;
        font-weight: 600;
        line-height: 36px;
        padding-left: 5px;
      }
      #version {
        line-height: 36px;
        font-size: 18px;
        color: gray;
        padding-left: 15px;
      }
      #description {
        color: darkgray;
        font-size: 18px;
        line-height: 36px;
        padding-left: 5px;
      }
      #org {
        padding-left: 15px;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        transition: color ease-in 100ms;
        color: rgba(0,0,0,0.8);      
      }

      #org:hover{
        color: rgba(0,0,0,0.5);
      }

      #demo-holder{
        margin-bottom: 0px;
        padding-top: 10px;

      }

      .header{
        font-size: 20px;
      }

      hr {
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
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
    <div id="description"></div>
    <fancy-tabs>

      <div slot="title">demo</div>
      <div>
        <div id="demo-holder">
          <slot></slot>
        </div>
      </div>

      <div id="schemas-button" slot="title">Information</div> 
      <div>
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