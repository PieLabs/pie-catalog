const ShadyCSS = window.ShadyCSS;
const template = document.createElement('template');

template.innerHTML = `
    <style>
      :host {
        display: block;
        height: 60px;
        min-height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        background-color: var(--catalog-header-bg, green);
        border-bottom: solid 1px var(--shadow-color, #cccccc);
      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      a{
        font-size: 14px;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--pie-brand-color, #333333);
        transition: color 100ms linear;
        margin-right: 10px;
      }
      
      a:hover{
        color: var(--pie-brand-hover-color, #300333);
      }

      pie-brand{
        margin-right: 10px;
      }


    </style>
    <pie-brand></pie-brand>
    <a href="//pielabs.github.io/pie-docs/" target="_blank">Documentation</a>
    `;


ShadyCSS.prepareTemplate(template, 'catalog-header');

export default class CatalogHeader extends HTMLElement {

  constructor() {
    super();

    ShadyCSS.applyStyle(this);

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      let copy = document.importNode(template, true);
      this.shadowRoot.appendChild(copy.content);
    }

    //let sr = this.attachShadow({ mode: 'open' });

    /*sr.innerHTML = `
    <style>
      :host {
        display: block;
        height: 60px;
        min-height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        background-color: var(--catalog-header-bg, green);
        border-bottom: solid 1px var(--shadow-color, #cccccc);
      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      a{
        font-size: 14px;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--pie-brand-color, #333333);
        transition: color 100ms linear;
        margin-right: 10px;
      }
      
      a:hover{
        color: var(--pie-brand-hover-color, #300333);
      }

      pie-brand{
        margin-right: 10px;
      }


    </style>
    <pie-brand></pie-brand>
    <a href="//pielabs.github.io/pie-docs/" target="_blank">Documentation</a>
    `; */
  }

  connectedCallback() {
    // ShadyCSS.applyStyle(this);

    // if (!this.shadowRoot) {
    //   this.attachShadow({ mode: 'open' });
    //   let copy = document.importNode(template, true);
    //   console.log('copy: ', copy);
    //   this.shadowRoot.appendChild(copy.content);
    // }
    // console.log('shadowRoot: ', this.shadowRoot.innerHTML);

    this.shadowRoot.querySelector('pie-brand').addEventListener('click', e => {
      document.location.pathname = '/';
      // this.dispatchEvent(new CustomEvent('home-click', { bubbles: true }));
    });
  }
}