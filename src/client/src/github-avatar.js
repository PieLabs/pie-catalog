/**
 * Note: cant subclass HTMLImageElement yet see: https://www.chromestatus.com/feature/4670146924773376
 */
export default class GithubAvatar extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `<img></img>`;
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
    let size = this.getAttribute('size') || '40';

    if (user) {

      fetch(`//api.github.com/users/${user}`, { mode: 'cors' })
        .then(r => {
          console.log('d: ', r);
          r.json()
            .then(d => {
              this.shadowRoot
                .querySelector('img')
                .setAttribute('src', `${d.avatar_url}&s=${size}`);
            });
        });
    }
  }

  connectedCallback() {
    this.loadAvatar();
  }
}