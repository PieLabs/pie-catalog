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


    .p, .i, .e {
      color: #404042;
    }

    .other {
      color: #64B362;
      color: #1095D4;
    }
    
    </style>
    <span class="p">p</span><span class="i">i</span><span class="e">e</span>
    `;
  }
}