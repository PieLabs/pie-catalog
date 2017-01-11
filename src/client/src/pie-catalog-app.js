import { VIEW_ORG, VIEW_REPO } from './events';
import { elements } from './client';
import takeRight from 'lodash/takeRight';

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
    return elements.list()
      .then(result => {
        this.shadowRoot.querySelector('catalog-listings').elements = result.elements;
      });
  }

  loadEntry(org, repo) {
    return elements.load(org, repo)
      .then(result => {
        this.shadowRoot.querySelector('catalog-entry').element = result;
      });
  }

  loadOrg(org) {
    return elements.listByOrg(org)
      .then(result => {
        this.shadowRoot.querySelector('catalog-org').org = result;
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
    let state = history.state || { view: 'none' };
    switch (state.view) {
      case 'home':
        this.loadListings().then(() => this.showListings());
        break;
      case 'element':
        this.loadEntry(state.org, state.repo).then(() => this.showEntry());
        break;
      case 'org':
        this.loadOrg(state.org).then(() => this.showOrg());
        break;
      default:
        console.error('????');
        break;
    }
  }

  initHistory() {
    let path = document.location.pathname;
    if (path === '/') {
      history.replaceState({ view: 'home' }, 'home', '/');
    } else if (path.indexOf('/org/') !== -1) {
      let org = path.split('/org/')[1];
      history.replaceState({ view: 'org', org: org }, 'org', `/org/${org}`);
    } else if (path.indexOf('/element/') !== -1) {
      let [org, repo] = takeRight(path.split('/'), 2);
      history.replaceState({ view: 'element', org: org, repo: repo }, 'repo', `/element/${org}/${repo}`);
    }
  }

  connectedCallback() {

    window.onpopstate = (e) => {
      this.updateLayout();
    };



    this.shadowRoot.querySelector('catalog-header').addEventListener('home-click', e => {
      history.pushState({ view: 'home' }, 'home', '/');
      this.updateLayout();
    });

    this.addEventListener(VIEW_REPO, (e) => {
      let data = event.detail.element;
      let state = {
        view: 'element',
        org: data.org,
        repo: data.repo
      };
      window.history.pushState(state, 'view element', `/element/${data.org}/${data.repo}`);
      this.updateLayout();
    });

    this.addEventListener(VIEW_ORG, (e) => {
      let data = event.detail.element;
      let state = {
        view: 'org',
        org: data.org
      }
      window.history.pushState(state, 'view org', `/org/${data.org}`);
      this.updateLayout();
    });

    this.initHistory();
    this.updateLayout();
  }
}