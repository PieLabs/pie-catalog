/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class CatalogEntry extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    <style>

      :host {
        display: block;
        padding: 10px;
        position:relative;
        background-color: var(--shadow-color, hsla(0,0%, 0%, 0.1));
      }

      .header {
        display: flex;
        align-items: bottom;
      }

      #repo, #version {
        font-weight: bold;
        font-size: 19px;
        padding-left: 5px;
      }

      #version{
        color: grey;
      }

      #org {
        padding-left: 5px;
        color: #cccccc;
        font-style: italic;
        font-size: 19px;
      }

      hr {
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

      #demo-holder{
        padding-top: 20px;
      }

      iframe{
        width: 100%;
        height: 400px;
        background-color: white;
        box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

    </style>
    <div class="header">
      <div id="repo"></div>
      <div id="version"></div>
      <div id="org"></div>
    </div>
    <hr/>
    <div id="description"></div>
    <div id="demo-holder"></demo>
    `;
  }

  connectedCallback() {
    console.log('catalog entry connected');
  }

  set element(e) {
    this._element = e;

    this.shadowRoot.querySelector('#repo').textContent = e.repo;
    this.shadowRoot.querySelector('#version').textContent = e.version;
    this.shadowRoot.querySelector('#org').textContent = `by ${e.org}`;
    this.shadowRoot.querySelector('#description').textContent = e.description;

    this.shadowRoot.querySelector('#demo-holder').innerHTML = `
     <iframe src="${e.demoLink}" frameborder="0"></iframe>
    `
  }
}
/* harmony export (immutable) */ exports["a"] = CatalogEntry;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class CatalogHeader extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
      :host {
        display: block;
        height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        border-bottom: solid 1px var(--shadow-color, #cccccc);
      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      #pie-logo{
        cursor: pointer;
      }

    </style>
    <h1 id="pie-logo">pie</h1>
    `;
  }

  connectedCallback() {
    console.log('connected header');

    this.shadowRoot.querySelector('#pie-logo').addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent('home-click', { bubbles: true }));
    });
  }
}
/* harmony export (immutable) */ exports["a"] = CatalogHeader;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class CatalogListing extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

    <style>
     :host{
        width: 300px;
        display: block;
        cursor: pointer;
        padding: 10px;
        background-color: white;
        box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }
      

      h4 {
        padding: 0;
        margin: 0;
      }

      hr {
        border: none;
        border-bottom: solid 1px var(--shadow-color, hsla(0, 0%, 0%, 0.1));
      }

      #description {
        font-size: 14px;
      }

      .footer{
        display: flex;
        align-items: center;
        padding: 2px;
      }
      #org{
        padding: 6px;
      }
    </style>

    <h4 id="repo"></h4>
    <span id="description"></span>
    <hr/>
    <div class="footer">
      <img src="https://avatars.githubusercontent.com/u/23503597?v=3&s=40"></img> 
      <label id="org"></label>
    </div>
    `;
  }

  set element(e) {
    this._element = e;
    this.shadowRoot.querySelector('#org').textContent = e.org;
    this.shadowRoot.querySelector('#repo').textContent = e.repo;
    this.shadowRoot.querySelector('#description').textContent = e.description;
  }

  get element() {
    return this._element;
  }

  connectedCallback() {
    console.log('connected');

    // this.shadowRoot.querySelector('.root').addEventListener('click', () => {
    //   console.log('listing clicked');
    // })
  }

}
/* harmony export (immutable) */ exports["a"] = CatalogListing;



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class CatalogListings extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
        :host {
          display: block;
          background-color:#eeeeee;
          padding: 10px;
          margin: 10px;
        }
    </style>
    <div class="elements">
    </div>
    `;
  }

  connectedCallback() {
    console.log('connected');
  }

  set elements(e) {
    this._elements = e;
    let markup = this._elements.map((n, index) => {
      return `<catalog-listing data-index="${index}"></catalog-listing>`;
    });

    this.shadowRoot.querySelector('.elements').innerHTML = markup.join('\n');

    customElements.whenDefined('catalog-listing').then(() => {
      this.shadowRoot.querySelectorAll('catalog-listing').forEach((n, i) => {
        let index = parseInt(n.getAttribute('data-index'));
        n.element = this._elements[index];

        n.addEventListener('click', (e) => {
          console.log('node clicked', event.target);
          this.dispatchEvent(
            new CustomEvent(
              'listing-clicked',
              { bubbles: true, detail: { element: e.target.element } }
            ));
        });
      });
    });
  }
}
/* harmony export (immutable) */ exports["a"] = CatalogListings;



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


class PieCatalogApp extends HTMLElement {

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
/* harmony export (immutable) */ exports["a"] = PieCatalogApp;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pie_catalog_app__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__listings__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__listing__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__catalog_entry__ = __webpack_require__(0);

customElements.define('pie-catalog-app', __WEBPACK_IMPORTED_MODULE_0__pie_catalog_app__["a" /* default */]);


customElements.define('catalog-listings', __WEBPACK_IMPORTED_MODULE_1__listings__["a" /* default */]);


customElements.define('catalog-listing', __WEBPACK_IMPORTED_MODULE_2__listing__["a" /* default */]);


customElements.define('catalog-header', __WEBPACK_IMPORTED_MODULE_3__header__["a" /* default */]);


customElements.define('catalog-entry', __WEBPACK_IMPORTED_MODULE_4__catalog_entry__["a" /* default */]);


/***/ }
/******/ ]);