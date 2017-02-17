import { LoadAvatar } from './avatar-service';

export default class GithubAvatar extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
    :host{
      display: inline-block;
    }
    </style>
    <img></img>`;
  }

  static get observedAttributes() {
    return ['user', 'url'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'user' && newValue) {
      //remove the old url
      this.removeAttribute('url');
      this.loadAvatar();
    } else if (name === 'url' && newValue) {
      this.shadowRoot
        .querySelector('img')
        .setAttribute('src', this.getAttribute('url'));
    }
  }

  loadAvatar() {
    let user = this.getAttribute('user');
    if (user) {
      this.dispatchEvent(new LoadAvatar(user, this));
    }
  }

  connectedCallback() {
    let img = this.shadowRoot.querySelector('img');
    img.setAttribute('width', this.getAttribute('size'));
    img.setAttribute('height', this.getAttribute('size'));
    this.loadAvatar();
  }
}