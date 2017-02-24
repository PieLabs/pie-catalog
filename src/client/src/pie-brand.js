import { prepareTemplate, applyStyle } from './styles';

const templateHTML = `
    <style>
    
    :host{
       cursor: pointer;
       font-family: 'Patua One', serif;
    }

    .pie {
      font-size: 39px;
      font-family: 'Patua One', serif;
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
    <span class="pie">pie catalog</span>
`;

export default class PieBrand extends HTMLElement {
  constructor() {
    super();
    applyStyle(this, prepareTemplate(templateHTML, 'pie-brand'));
  }
}