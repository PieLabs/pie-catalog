/**
 * Note: cant subclass HTMLImageElement yet see: https://www.chromestatus.com/feature/4670146924773376
 */

export class LoadAvatarEvent extends CustomEvent {
  constructor(user, url) {

    super(LoadAvatarEvent.TYPE, { bubbles: true, composed: true });
    this.user = user;
    this.setUrl = url;
  }
}

LoadAvatarEvent.prototype.TYPE = 'load-avatar';

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
    return ['user'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'user') {
      if (newValue) {
        this.loadAvatar();
      }
    }
  }

  loadAvatar() {
    let user = this.getAttribute('user');

    if (user) {
      this.dispatchEvent(new LoadAvatarEvent(user, (url) => {
        this.shadowRoot
          .querySelector('img')
          .setAttribute('src', url);
      }));
    }
  }

  connectedCallback() {
    let img  = this.shadowRoot.querySelector('img');
    img.setAttribute('width', this.getAttribute('size'));
    img.setAttribute('height', this.getAttribute('size'));
    this.loadAvatar();
  }
}