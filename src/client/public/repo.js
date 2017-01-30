/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length)
/******/ 			resolves.shift()();

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		3: 0
/******/ 	};

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

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return Promise.resolve();

/******/ 		// an Promise means "currently loading".
/******/ 		if(installedChunks[chunkId]) {
/******/ 			return installedChunks[chunkId][2];
/******/ 		}
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;

/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + {"0":"0e449f73efb2d52ade49"}[chunkId] + "." + chunkId + ".js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};

/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunks[chunkId][2] = promise;

/******/ 		head.appendChild(script);
/******/ 		return promise;
/******/ 	};

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
/******/ 	__webpack_require__.p = "/";

/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class LoadAvatar extends CustomEvent {
  constructor(user, el) {
    super('load-avatar', { bubbles: true, composed: true });
    this.user = user;
    this.element = el;
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = LoadAvatar;


LoadAvatar.TYPE = 'load-avatar';

class AvatarService extends HTMLElement {

  connectedCallback() {

    this.template = this.getAttribute('url-template');

    if (!this.template) {
      console.error('service is missing url-template attribute');
    }

    console.log('avatar-service connected', LoadAvatar.TYPE);
    document.addEventListener(LoadAvatar.TYPE, e => {
      console.log('load avatar: ', e.element);
      let url = this.template.replace(':user', e.user);
      e.element.setAttribute('url', url);
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarService;


/***/ }),

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = viewRepo;
/* harmony export (immutable) */ __webpack_exports__["c"] = viewOrg;

const VIEW_ORG = 'view-org';
/* harmony export (immutable) */ __webpack_exports__["d"] = VIEW_ORG;

const VIEW_REPO = 'view-repo';
/* harmony export (immutable) */ __webpack_exports__["a"] = VIEW_REPO;


function viewRepo(element) {
  return new CustomEvent(VIEW_REPO, {
    bubbles: true,
    composed: true,
    detail: {
      element: element
    }
  });
}

function viewOrg(element) {
  return new CustomEvent(VIEW_ORG, {
    bubbles: true,
    composed: true,
    detail: {
      element: element
    }
  });
}


/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CatalogContainer extends HTMLElement {

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
        ::slotted(catalog-entry) { 
          margin: 10px;
          padding: 10px;
        } 
      </style>
      <catalog-header></catalog-header>
      <slot></slot>
    `;
  }

  connectedCallback() {

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CatalogContainer;


/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pie_brand__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__progress_bar__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__github_avatar__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__catalog_container__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__client__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__avatar_service__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__events__ = __webpack_require__(1);

customElements.define('catalog-header', __WEBPACK_IMPORTED_MODULE_0__header__["a" /* default */]);


customElements.define('pie-brand', __WEBPACK_IMPORTED_MODULE_1__pie_brand__["a" /* default */]);


customElements.define('progress-bar', __WEBPACK_IMPORTED_MODULE_2__progress_bar__["a" /* default */]);


customElements.define('github-avatar', __WEBPACK_IMPORTED_MODULE_3__github_avatar__["a" /* default */]);


customElements.define('catalog-container', __WEBPACK_IMPORTED_MODULE_4__catalog_container__["a" /* default */]);




customElements.define('avatar-service', __WEBPACK_IMPORTED_MODULE_6__avatar_service__["a" /* default */]);




let logic = __webpack_require__.e/* require.ensure */(0).then((() => {

  const {define} = __webpack_require__(15);
  define();

  const MarkdownElement = __webpack_require__(23).default;
  customElements.define('markdown-element', MarkdownElement);

  const CatalogSchemas = __webpack_require__(24).default;
  customElements.define('catalog-schemas', CatalogSchemas);

  const { default: IframeHolder } = __webpack_require__(21);
  customElements.define('iframe-holder', IframeHolder);

  const CatalogEntry = __webpack_require__(18).default;
  customElements.define('catalog-entry', CatalogEntry);

  const { default: DependenciesPanel, DependencyEl } = __webpack_require__(19);
  customElements.define('dependencies-panel', DependenciesPanel);
  customElements.define('dependency-el', DependencyEl);

  const { default: InfoPanel, GithubInfoCount } = __webpack_require__(22);
  customElements.define('info-panel', InfoPanel);
  customElements.define('github-info-count', GithubInfoCount);

  //Note: these elements auto register themselves
  __webpack_require__(17);

  const FancyTabs = __webpack_require__(20).default;
  customElements.define('fancy-tabs', FancyTabs);

}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);

document.addEventListener('DOMContentLoaded', () => {

  let info = __WEBPACK_IMPORTED_MODULE_5__client__["a" /* elements */].load(window.pie.org, window.pie.repo);

  customElements.whenDefined('github-avatar')
    .then(() => {

    });
  Promise.all([logic, info])
    .then(([l, infoResult]) => {
      document.querySelector('catalog-entry').element = infoResult;
      document.querySelector('catalog-entry').config = window.pie.config;
    })
    .catch((e) => {
      console.error(e);
    });
});

document.addEventListener(__WEBPACK_IMPORTED_MODULE_7__events__["d" /* VIEW_ORG */], (e) => {
  let org = event.detail.element.org;
  window.location.href = `/org/${org}/`;
});


/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return elements; });
class Elements {

  list() {
    return fetch('/api/element')
      .then(response => response.json())
      .catch(e => {
        console.error(e);
      });
  }

  load(org, repo) {
    return fetch(`/api/element/${org}/${repo}`)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('error: ' + response.statusText);
        }
      })
      .then(r => r.json())
      .catch(e => {
        console.error(e);
      });
  }

  listByOrg(org) {
    return fetch(`/api/org/${org}`)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('error: ' + response.statusText);
        }
      })
      .then(r => r.json())
      .catch(e => {
        console.error(e);
      });
  }

}

let elements = new Elements();

/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__avatar_service__ = __webpack_require__(0);


class GithubAvatar extends HTMLElement {

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
    console.log('attr changed:', arguments);
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
      console.log('dispatch event ..')
      this.dispatchEvent(new __WEBPACK_IMPORTED_MODULE_0__avatar_service__["b" /* LoadAvatar */](user, this));
    }
  }

  connectedCallback() {
    let img = this.shadowRoot.querySelector('img');
    img.setAttribute('width', this.getAttribute('size'));
    img.setAttribute('height', this.getAttribute('size'));
    this.loadAvatar();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GithubAvatar;


/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

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
        min-height: 60px;
        padding-top: 5px;
        padding-left: 5px;
        background-color: var(--catalog-header-bg, green);
        border-bottom: solid 1px var(--shadow-color, #cccccc);

      }
      
      h1 {
        margin: 0;
        padding: 0;
      }

      a{
        font-size: 14px;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--pie-brand-color, #333333);
        transition: color 100ms linear;
        margin-right: 10px;
      }
      
      a:hover{
        color: var(--pie-brand-hover-color, #300333);
      }

      pie-brand{
        margin-right: 10px;
      }


    </style>
    <pie-brand></pie-brand>
    <a href="//pielabs.github.io/pie-docs/" target="_blank">Documentation</a>
    `;
  }

  connectedCallback() {
    console.log('connected header');

    this.shadowRoot.querySelector('pie-brand').addEventListener('click', e => {
      document.location.pathname = '/';
      // this.dispatchEvent(new CustomEvent('home-click', { bubbles: true }));
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CatalogHeader;


/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PieBrand extends HTMLElement {
  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `
    <style>
    
    :host{
       cursor: pointer;
       font-family: 'Patua One', serif;
    }

    * {
       font-size: 39px;
    }

    .pie {
      color: var(--pie-brand-color, #404042);
      transition:color 100ms linear;
      cursor: pointer;
    }
    
    .pie:hover{
      color: var(--pie-brand-hover-color,#64B362);
    }

    .other {
      color: #1095D4;
    }
    
    </style>
    <span class="pie">pie</span>
    `;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PieBrand;


/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ProgresBar extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host{
          display: block;
          overflow: hidden;
        }
        
        :host([disabled]) #progress{
          opacity: 0;
        }

        #progress {
          opacity: 1;
          width: 100%;
          height: 1px;
          background-color: var(--progress-bar-color, rgba(0,0,0,0.2));
          transition: opacity 100ms ease-in;
          -webkit-transform-origin: right center;
          transform-origin: right center;
          -webkit-animation: indeterminate-bar 2s linear infinite;
          animation: indeterminate-bar 2s linear infinite;
        }
        
        @-webkit-keyframes indeterminate-bar {
          0% {
            -webkit-transform: scaleX(1) translateX(-100%);
          }
          50% {
            -webkit-transform: scaleX(1) translateX(0%);
          }
          75% {
            -webkit-transform: scaleX(1) translateX(0%);
            -webkit-animation-timing-function: cubic-bezier(.28,.62,.37,.91);
          }
          100% {
            -webkit-transform: scaleX(0) translateX(0%);
          }
        }


      </style>
      <div id="progress" hidden></div>
    `
  }

  enable() {
    this.removeAttribute('disabled');
  }

  disable() {
    this.setAttribute('disabled', '');
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#progress').removeAttribute('hidden');
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProgresBar;


/***/ })

/******/ });