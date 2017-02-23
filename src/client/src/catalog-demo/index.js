import * as styles from '../styles.js';

export default class CatalogDemo extends HTMLElement {
  constructor() {
    super();

    /** Note: can't use shadow root if the inner element is dependentent 
     * on style definitions that uses markup from inside the element.
     */

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
      :host{
        display: block;
      }

      control-panel{
        display: block;
        padding-bottom: 10px;
      }

      .pie-panel{
        border-radius: 10px;
        ${styles.boxShadow}
        box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.3));
        padding: 10px;
        margin-top: 20px;
      }

      .pie-panel.black-on-rose {
        background-color: mistyrose;
      }

      .pie-panel.white-on-black {
        background-color: black;
        color: white;
      }
    </style>
    <control-panel></control-panel>
    <div class="pie-panel">
      <slot></slot> 
    </div>
    `;

    this._registeredPies = {};
    this._sessions = [];
    this._env = {
      mode: 'gather'
    }

    this.addEventListener('pie.register', (e) => {
      let id = e.target.getAttribute('pie-id');
      this._registeredPies[id] = e.target;
      this._updatePies();
    });
  }

  connectedCallback() {
    this.$controlPanel = this.shadowRoot.querySelector('control-panel');
    this.$piePanel = this.shadowRoot.querySelector('.pie-panel');

    customElements.whenDefined('control-panel')
      .then(() => {
        this.$controlPanel.env = this._env;
      });

    this.$controlPanel.addEventListener('env-changed', e => {
       let classFromEnv = (e) => {
        const colorMap = {
          black_on_rose: 'black-on-rose',
          white_on_black: 'white-on-black',
          black_on_white: 'default'
        };
        if (e.accessibility && e.accessibility.colorContrast && colorMap[e.accessibility.colorContrast]) {
          return colorMap[e.accessibility.colorContrast];
        }
      };
      this.$piePanel.setAttribute('class', `pie-panel ${classFromEnv(e.detail.env)}`);
      this._updatePies();
    });
  }

  set markup(m) {
    this.innerHTML = m;
  }

  set config(c) {
    this._config = c;

    customElements.whenDefined('control-panel')
      .then(() => {
        this.$controlPanel.langs = this._config.langs;
      });

    this._updatePies();
  }

  set controllers(c) {
    console.log('set controllers: ', c);
    this._controllers = c;
    this._updatePies();
  }

  _getSessionById(id) {
    let session = this._sessions.find(v => v.id === id);
    if (!session) {
      session = { id: id };
      this._sessions.push(session);
    }
    return session;
  }

  _updatePies() {
    if (!this._config || !this._controllers) {
      return;
    }

    Object.keys(this._registeredPies).forEach(id => {
      let node = this._registeredPies[id];
      let model = this._config.models.find(v => v.id === id);
      let session = this._getSessionById(id)
      let controller = this._controllers[node.nodeName.toLowerCase()];
      controller.model(model, session, this._env)
        .then(m => {
          node.session = session;
          node.model = m;
        });
    });
  }

}