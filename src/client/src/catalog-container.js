import { prepareTemplate, applyStyle } from './styles';

const template = prepareTemplate(`
  <style>
    :host{
      display: flex;
      flex-direction: column; 
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }

    catalog-header{
      flex: 0 0 auto;
      height: 40px;
    }
    
    progress-bar{
      flex: 0;
      min-height: 1px;
    } 
    
    catalog-footer{
      min-height: 20px;
      flex: 0;
    }

    #slot-holder[loading]{
      opacity: 0.0;
    }
    
    #slot-holder{
      transition: opacity 200ms linear;
      opacity: 1;
      padding: 10px;
      flex: 1;
    }

  </style>
  <catalog-header></catalog-header> 
  <progress-bar></progress-bar>
  <div id="slot-holder" loading>
    <slot></slot> 
  </div>
  <catalog-footer></catalog-footer>
`, 'catalog-container');


export default class CatalogContainer extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, template)
    this._$slotHolder = sr.querySelector('#slot-holder');
  }

  get _progressBar() {
    return this.shadowRoot.querySelector('progress-bar');
  }

  get _content() {
    return this.shadowRoot.querySelector('#content');
  }

  set version(v) {
    this.shadowRoot.querySelector('catalog-footer').version = v;
  }


  isLoading(loading) {
    if (!this._progressBar) {
      return;
    }

    loading ?
      this._progressBar.enable() :
      this._progressBar.disable();

    loading ? this._$slotHolder.setAttribute('loading', '') :
      this._$slotHolder.removeAttribute('loading');
  }
}