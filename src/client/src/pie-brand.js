export default class PieBrand extends HTMLElement {
  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
    
    :host{
       cursor: pointer;
       font-family: 'Patua One', serif;
    }

    * {
       font-size: 39px;
    }

    .pie {
      color: var(--pie-brand-color, #404042);
      transition:color 100ms linear;
      cursor: pointer;
    }
    
    .pie:hover{
      color: var(--pie-brand-hover-color,#64B362);
    }

    .other {
      color: #1095D4;
    }
    
    </style>
    <span class="pie">pie</span>
    `;
  }
}