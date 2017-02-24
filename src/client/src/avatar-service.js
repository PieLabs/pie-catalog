export class LoadAvatar extends CustomEvent {
  constructor(user, el) {
    super('load-avatar', { bubbles: true, composed: true });
    this.user = user;
    this.element = el;
  }
}

LoadAvatar.TYPE = 'load-avatar';

export default class AvatarService extends HTMLElement {

  connectedCallback() {

    this.template = this.getAttribute('url-template');

    if (!this.template) {
      console.error('service is missing url-template attribute');
    }

    document.addEventListener(LoadAvatar.TYPE, e => {
      let url = this.template.replace(':user', e.user);
      e.element.setAttribute('url', url);
    });
  }
}