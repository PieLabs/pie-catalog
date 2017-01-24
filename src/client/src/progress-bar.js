export default class ProgresBar extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host{
          display: block;
          overflow: hidden;
        }
        
        :host([disabled]) #progress{
          opacity: 0;
        }

        #progress {
          opacity: 1;
          width: 100%;
          height: 1px;
          background-color: var(--progress-bar-color, rgba(0,0,0,0.2));
          transition: opacity 100ms ease-in;
          -webkit-transform-origin: right center;
          transform-origin: right center;
          -webkit-animation: indeterminate-bar 2s linear infinite;
          animation: indeterminate-bar 2s linear infinite;
        }
        
        @-webkit-keyframes indeterminate-bar {
          0% {
            -webkit-transform: scaleX(1) translateX(-100%);
          }
          50% {
            -webkit-transform: scaleX(1) translateX(0%);
          }
          75% {
            -webkit-transform: scaleX(1) translateX(0%);
            -webkit-animation-timing-function: cubic-bezier(.28,.62,.37,.91);
          }
          100% {
            -webkit-transform: scaleX(0) translateX(0%);
          }
        }


      </style>
      <div id="progress" hidden></div>
    `
  }

  enable() {
    this.removeAttribute('disabled');
  }

  disable() {
    this.setAttribute('disabled', '');
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#progress').removeAttribute('hidden');
  }

}