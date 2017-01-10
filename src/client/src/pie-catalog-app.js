

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

  showListings() {
    this.shadowRoot.querySelector('catalog-entry').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-listings').removeAttribute('hidden');
  }

  showEntry() {
    this.shadowRoot.querySelector('catalog-entry').removeAttribute('hidden');
    this.shadowRoot.querySelector('catalog-listings').setAttribute('hidden', '');
  }

  updateLayout() {
    let path = document.location.pathname;

    if (path === '/') {
      this.loadListings()
        .then(() => this.showListings());
    } else {
      this.loadEntry(path)
        .then(() => this.showEntry());
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

    this.shadowRoot.querySelector('catalog-listings').addEventListener('listing-clicked', (e) => {
      let data = event.detail.element;
      window.history.pushState(data, 'view element', event.detail.element.repoLink);
      this.updateLayout();
    });

    this.updateLayout();
  }
}