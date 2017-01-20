export default class PieBrand extends HTMLElement{
  constructor(){
    super();

    let sr = this.attachShadow({mode: 'open'});

    sr.innerHTML = `
    <style>
    
    :host{
       cursor: pointer;
    }

    * {
       font-size: 39px;
    }

    .p{
      color: #1095D4;
    }

    .i {
      color: #64B362;
    }

    .e {
      color: #404042;
    }
    
    </style>
    <span class="p">p</span><span class="i">i</span><span class="e">e</span>
    `;
  }
}