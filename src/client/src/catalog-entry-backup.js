import * as events from './events';
import { prepareTemplate, applyStyle } from './styles';

const templateHTML = `
    <style>

      :host {
        display: block;
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
        <!-- <div id="description"></div>
         <div id="demo-holder"> -->
         <div style="height: 100px; background-color: red;">here is the slot</div>
          <slot></slot>
        <!-- </div>
        <div id="markdown-holder">
          <markdown-element></markdown-element>
        </div> -->
    <!-- <fancy-tabs>
      <button slot="title">info</button>
      <button id="schemas-button" slot="title">schemas</button>
      <div>
        <div id="description"></div>
        <div id="demo-holder">
          <slot></slot>
        </div>
        <div id="markdown-holder">
          <markdown-element></markdown-element>
        </div>
        <info-panel></info-panel>
        <dependencies-panel></dependencies-panel>
      </div>
      <div>
        <catalog-schemas></catalog-schemas>
      </div>
      
    </fancy-tabs> -->
`;

export default class CatalogEntry extends HTMLElement {

  constructor() {
    super();
    const template = prepareTemplate(templateHTML, 'catalog-entry');
    let sr = applyStyle(this, template);
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
    this.shadowRoot.querySelector('#org').textContent = `by ${e.org}`;
    this.shadowRoot.querySelector('github-avatar').setAttribute('user', e.org);

    this.shadowRoot.querySelector('#org').addEventListener('click', (e) => {
      this.dispatchEvent(events.viewOrg(this._element));
    });

    // customElements.whenDefined('info-panel')
    //   .then(() => {
    //     this.shadowRoot.querySelector('info-panel').github = e.github;
    //   });

    // this.shadowRoot.querySelector('markdown-element').markdown = e.readme;

    // this.shadowRoot.querySelector('#description').textContent = e.package.description;

    // if (!e.schemas || e.schemas.length === 0) {
    //   this.shadowRoot.querySelector('#schemas-button').setAttribute('hidden', '');
    // } else {
    //   this.shadowRoot.querySelector('catalog-schemas').schemas = e.schemas;
    // }

    // customElements.whenDefined('dependencies-panel').then(() => {
    //   this.shadowRoot.querySelector('dependencies-panel').dependencies = e.package.dependencies;
    // });

  }

}