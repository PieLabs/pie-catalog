export default class IframeHolder extends HTMLElement {
  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
      :host{
        display: block;
        width: 100%;
        height: 100%;
      }

      iframe[hide]{
        opacity: 0;
      }

      .holder{
        width: 100%;
        height: 100%;
      } 
      
      iframe{
        width: 100%;
        height: 100%;
        opacity: 1;
        transition: opacity 200ms ease-in;
      } 

    </style>
    <progress-bar></progress-bar>
    <div class="holder"></div>
    `;
  }

  set src(s) {
    this._src = s;
    this.loadSrc();
  }

  get _progressBar() {
    return this.shadowRoot.querySelector('progress-bar');
  }

  loadSrc() {
    this._progressBar.enable();
    this.shadowRoot.querySelector('.holder').innerHTML = '';
    this._iframe = document.createElement('iframe');
    this._iframe.addEventListener('load', (e) => {
      setTimeout(() => {
        this._iframe.removeAttribute('hide');
        this._progressBar.disable();
      }, 10);
    });
    this._iframe.setAttribute('frameborder', '0');
    this._iframe.setAttribute('hide', '');
    this._iframe.setAttribute('src', this._src);
    this.shadowRoot.querySelector('.holder').appendChild(this._iframe);
  }
  connectedCallback() {
    console.log('[iframe-holder] connected');
  }
}