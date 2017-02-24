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

    ::slotted(*){
      padding: 10px;
      flex: 1;
    } 

    catalog-header{
      flex: 0 0 auto;
      height: 40px;
    }
    
    progress-bar{
      flex: 0;
    } 
    
    catalog-footer{
      min-height: 40px;
      flex: 0;
    }

  </style>
  <catalog-header></catalog-header> 
  <progress-bar disabled></progress-bar>
  <slot></slot> 
  <catalog-footer></catalog-footer>
`, 'catalog-container');


export default class CatalogContainer extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, template)
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
    console.log('isLoading? ', loading);
    if (!this._progressBar) {
      return;
    }

    loading ?
      this._progressBar.enable() :
      this._progressBar.disable();
  }
}