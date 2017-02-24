// const template = document.createElement('template');
import { prepareTemplate, applyStyle } from './styles';

//display: flex;

/**
 * 
  :host { 
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }

  .big{
    flex: 1;
  }

  catalog-header{
    flex: 0 0 auto;
    height: 40px;
  }
  catalog-footer{
    height: 40px;
  }

  </style>
    // ::slotted(*){
    //   display: block;
    //   flex: 1;
    // }
 * 
 */
const template = prepareTemplate(`
  <style>
    :host{
      display: flex;
      flex-direction: column; 
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
    
    catalog-header{
      flex: 0 0 auto;
      height: 40px;
    }
    catalog-footer{
      height: 40px;
    }
  </style>
  <catalog-header></catalog-header> 
  <progress-bar disabled></progress-bar>
  <div>
  <slot></slot> 
  </div>
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