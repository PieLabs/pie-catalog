import { VIEW_ORG, VIEW_REPO } from './events';

export default class PieCatalogApp extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

      <style>
        :host {
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;

        }
        .content{
          position: relative;
          flex-grow: 1;
        }

        [hidden] {
          display:none;
        }

        catalog-listings, catalog-entry {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      </style>

      <catalog-header></catalog-header>

      <div class="content">
        <catalog-listings></catalog-listings>
        <catalog-entry></catalog-entry>
        <catalog-org></catalog-org>
      </div>
    `;
  }


  loadListings() {
    return fetch('/api/elements')
      .then(response => response.json())
      .then(json => {
        this.shadowRoot.querySelector('catalog-listings').elements = json;
      })
      .catch(e => {
        console.error(e);
      });
  }

  loadEntry(link) {
    return fetch(`/api${link}`)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('error: ' + response.statusText);
        }
      })
      .then(response => response.json())
      .then(json => {
        this.shadowRoot.querySelector('catalog-entry').element = json;
      })
      .catch(e => {
        console.error(e);
      });
  }

  loadOrg(link) {
    return fetch(`/api${link}`)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('error: ' + response.statusText);
        }
      })
      .then(r => r.json())
      .then(json => {
        this.shadowRoot.querySelector('catalog-org').org = json;
      })
      .catch(e => {
        console.error(e);
      });
  }

  showListings() {
    this.shadowRoot.querySelector('catalog-entry').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-org').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-listings').removeAttribute('hidden');
  }

  showEntry() {
    this.shadowRoot.querySelector('catalog-org').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-listings').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-entry').removeAttribute('hidden');
  }

  showOrg() {
    this.shadowRoot.querySelector('catalog-org').removeAttribute('hidden');
    this.shadowRoot.querySelector('catalog-listings').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-entry').setAttribute('hidden', '');
  }

  updateLayout() {
    let path = document.location.pathname;

    if (path === '/') {
      this.loadListings()
        .then(() => this.showListings());
    } else if (path.indexOf('/org/') !== -1) {
      this.loadOrg(path).then(() => this.showOrg());
    } else {
      this.loadEntry(path).then(() => this.showEntry());
    }
  }

  connectedCallback() {

    window.onpopstate = (e) => {
      this.updateLayout();
    };

    this.shadowRoot.querySelector('catalog-header').addEventListener('home-click', e => {
      history.pushState(null, 'home', '/');
      this.updateLayout();
    });

    this.addEventListener(VIEW_REPO, (e) => {
      let data = event.detail.element;
      window.history.pushState(data, 'view element', event.detail.element.repoLink);
      this.updateLayout();
    });

    this.addEventListener(VIEW_ORG, (e) => {
      let data = event.detail.element;
      window.history.pushState(data, 'view org', `/org/${event.detail.element.org}`);
      this.updateLayout();
    });

    this.updateLayout();
  }
}