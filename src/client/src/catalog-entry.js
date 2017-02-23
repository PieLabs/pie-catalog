import * as events from './events';
import { prepareTemplate, applyStyle } from './styles';

const templateHTML = `
    <style>

      :host { 
        display: block;
      }
      
      .header {
        display: flex;
        align-items: bottom;
        font-size: 20px;
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


    </style>
   <div>
     <div class="header">
       <div id="repo">Repo</div>
       <div id="version">Version</div>
       <div id="org">Org</div>
       <github-avatar size="30"></github-avatar>
     </div>
     <c-tabs>
       <c-tab title="demo">
         <slot></slot>
       </c-tab>
       <c-tab title="other">
         other 
       </c-tab>
    </c-tabs>
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