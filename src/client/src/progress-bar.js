export default class ProgresBar extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        progress {
          width: 100%;
          height: 2px;
          background: white;
        }

        progress::-webkit-progress-bar {
          background: grey;
          border-radius: 0;
          padding: 0;
          box-shadow: 0 1px 0px 0 rgba(255, 255, 255, 0.2);
        }
        
        progress::-webkit-progress-value {
          background: red;
          border-radius: 0px;
          padding: 0;
          box-shadow: 0 1px 0px 0 rgba(255, 255, 255, 0.2);
        }
      </style>
      <progress max="100" value="40"></progress>
    `
  }

  connectedCallback() {

  }
}