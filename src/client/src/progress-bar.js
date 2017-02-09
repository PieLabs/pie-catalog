import { applyStyle, prepareTemplate } from './styles';

const templateHTML = `
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


const template = prepareTemplate(templateHTML, 'progress-bar');
export default class ProgressBar extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, template, true);
    this._$progress = sr.querySelector('#progress');
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