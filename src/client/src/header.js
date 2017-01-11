export default class CatalogHeader extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
      :host {
        display: block;
        height: 60px;
        min-height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        background-color: white;
        border-bottom: solid 1px var(--shadow-color, #cccccc);
      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      #pie-logo{
        cursor: pointer;
      }

    </style>
    <h1 id="pie-logo">pie</h1>
    `;
  }

  connectedCallback() {
    console.log('connected header');

    this.shadowRoot.querySelector('#pie-logo').addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent('home-click', { bubbles: true }));
    });
  }
}