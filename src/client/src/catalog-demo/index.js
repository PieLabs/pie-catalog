
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

    </style>
    <control-panel></control-panel>
    <slot></slot> 
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

    customElements.whenDefined('control-panel')
      .then(() => {
        this.$controlPanel.env = this._env;
      });

    this.$controlPanel.addEventListener('env-changed', e => {
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