const template = document.createElement('template');

template.innerHTML = `
      <style>
        :host{
          display: block;
          overflow: hidden;
        }

        #progress{
          opacity: 0;
          width: 100%;
          height: 1px;
          background-color: var(--progress-bar-color, rgba(0,0,0,0.2));
          transition: opacity 100ms ease-in;
          -webkit-transform-origin: right center;
          transform-origin: right center;
          -webkit-animation: indeterminate-bar 2s linear infinite;
          animation: indeterminate-bar 2s linear infinite;
        }

        #progress[loading] {
          opacity: 1;
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
    `;
ShadyCSS.prepareTemplate(template, 'progress-bar');

export default class ProgresBar extends HTMLElement {

  constructor() {
    super();

    ShadyCSS.applyStyle(this);

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      let copy = document.importNode(template, true);
      this.shadowRoot.appendChild(copy.content);
    }
    this._$progress = this.shadowRoot.querySelector('#progress');
  }

  enable() {
    this._$progress.setAttribute('loading', '');
  }

  disable() {
    this._$progress.removeAttribute('loading');
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#progress').removeAttribute('hidden');
  }

}