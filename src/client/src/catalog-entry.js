import * as events from './events';
import { prepareTemplate, applyStyle } from './styles';

const templateHTML = `
    <style>

      :host {
        display: flex;
        position: absolute;
        flex-direction: column;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
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
    </div>
   <div style="height: 100%">
     <slot></slot>
   </div>
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

    // this.shadowRoot.querySelector('#repo').textContent = e.repo;
    // this.shadowRoot.querySelector('#version').textContent = e.tag;
    // this.shadowRoot.querySelector('#org').textContent = `by ${e.org}`;
    // this.shadowRoot.querySelector('github-avatar').setAttribute('user', e.org);

    // this.shadowRoot.querySelector('#org').addEventListener('click', (e) => {
    // this.dispatchEvent(events.viewOrg(this._element));
    // });

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