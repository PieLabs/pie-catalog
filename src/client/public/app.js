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
/******/ 		1: 0
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
/******/ 		script.src = __webpack_require__.p + "" + chunkId + ".app.js";
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
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Note: cant subclass HTMLImageElement yet see: https://www.chromestatus.com/feature/4670146924773376
 */

class LoadAvatarEvent extends CustomEvent {
  constructor(user, url) {

    super(LoadAvatarEvent.TYPE, { bubbles: true, composed: true });
    this.user = user;
    this.setUrl = url;
  }
}
/* harmony export (immutable) */ exports["b"] = LoadAvatarEvent;


LoadAvatarEvent.prototype.TYPE = 'load-avatar';

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
/* harmony export (immutable) */ exports["a"] = GithubAvatar;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["b"] = viewRepo;
/* harmony export (immutable) */ exports["a"] = viewOrg;

const VIEW_ORG = 'view-org';
/* harmony export (immutable) */ exports["d"] = VIEW_ORG;

const VIEW_REPO = 'view-repo';
/* harmony export (immutable) */ exports["c"] = VIEW_REPO;


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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

var root = __webpack_require__(18);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ },
/* 3 */
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


    </style>
    <pie-brand></pie-brand>
    `;
  }

  connectedCallback() {
    console.log('connected header');

    this.shadowRoot.querySelector('pie-brand').addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent('home-click', { bubbles: true }));
    });
  }
}
/* harmony export (immutable) */ exports["a"] = CatalogHeader;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles__ = __webpack_require__(10);



class CatalogListing extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

    <style>
     :host{
        width: 300px;
        height: 100px;
        max-height: 100px;
        display: block;
        cursor: pointer;
        padding: 10px;
        background-color: white;
        ${__WEBPACK_IMPORTED_MODULE_1__styles__["a" /* boxShadow */]}
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
        display: block;
        font-size: 14px;
        height: 20px;
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
      <github-avatar size="40"></github-avatar>
      <label id="org"></label>
    </div>
    `;
  }

  set element(e) {
    this._element = e;
    this.shadowRoot.querySelector('#org').textContent = e.org;
    this.shadowRoot.querySelector('#repo').textContent = `${e.repo} - ${e.tag}`;
    this.shadowRoot.querySelector('#description').textContent = e.description;
    this.shadowRoot.querySelector('github-avatar').setAttribute('user', e.org);
  }

  get element() {
    return this._element;
  }

  connectedCallback() {
    let onRepoClick = (e) => {
      e.preventDefault();
      this.dispatchEvent(__WEBPACK_IMPORTED_MODULE_0__events__["b" /* viewRepo */](this._element));
    };

    let onOrgClick = (e) => {
      e.preventDefault();
      this.dispatchEvent(__WEBPACK_IMPORTED_MODULE_0__events__["a" /* viewOrg */](this._element));
    };

    this.shadowRoot.querySelector('#repo').addEventListener('click', onRepoClick);
    this.shadowRoot.querySelector('#description').addEventListener('click', onRepoClick);
    this.shadowRoot.querySelector('#org').addEventListener('click', onOrgClick);
  }

}
/* harmony export (immutable) */ exports["a"] = CatalogListing;



/***/ },
/* 5 */
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
          padding: 10px;
          margin: 10px;
        }

        .elements > catalog-listing {
          display: inline-block;
          margin: 4px;
        }
    </style>
    <div class="elements">
    </div>
    `;
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
      });
    });
  }
}
/* harmony export (immutable) */ exports["a"] = CatalogListings;



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class CatalogOrg extends HTMLElement {

  constructor() {
    super();

    let sr = this.attachShadow({ mode: 'open' });

    sr.innerHTML = `

    <style>
      .elements > catalog-listing {
        display: inline-block;
        margin: 4px;
      }

    </style>
    <h1 id="org">org</h1>
    <hr/>
    <div class="elements">
    </div>
    `;
  }


  set org(o) {
    this._org = o;

    this.shadowRoot.querySelector('#org').textContent = o.org;

    let markup = o.elements.map((e, i) => {
      return `<catalog-listing data-index="${i}"></catalog-listing>`;
    });

    this.shadowRoot.querySelector('.elements').innerHTML = markup.join('\n');

    this.shadowRoot.querySelectorAll('catalog-listing').forEach((n, i) => {
      let index = parseInt(n.getAttribute('data-index'));
      n.element = o.elements[index];
    });
  }
}
/* harmony export (immutable) */ exports["a"] = CatalogOrg;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class PieBrand extends HTMLElement{
  constructor(){
    super();

    let sr = this.attachShadow({mode: 'open'});

    sr.innerHTML = `
    <style>
    
    :host{
       cursor: pointer;
    }

    * {
       font-size: 39px;
    }

    .p{
      color: #1095D4;
    }

    .i {
      color: #64B362;
    }

    .e {
      color: #404042;
    }
    
    </style>
    <span class="p">p</span><span class="i">i</span><span class="e">e</span>
    `;
  }
}
/* harmony export (immutable) */ exports["a"] = PieBrand;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__client__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_takeRight__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_takeRight___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_takeRight__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__github_avatar__ = __webpack_require__(0);





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

      </style>

      <catalog-header></catalog-header>
      <progress-bar disabled></progress-bar>
      <div class="content">
        <catalog-listings></catalog-listings>
        <catalog-entry></catalog-entry>
        <catalog-org></catalog-org>
      </div>
    `;
  }

  error(e) {
    console.log(e);
  }

  entryReady() {
    console.log('the entry logic is ready');
    this._entryReady = true;
    this._progress.disable();
  }

  loadListings() {
    this._progress.enable();
    return __WEBPACK_IMPORTED_MODULE_1__client__["a" /* elements */].list()
      .then(result => {
        this.shadowRoot.querySelector('catalog-listings').elements = result.elements;
        this._progress.disable();
      });
  }

  loadEntry(org, repo) {
    this._progress.enable();
    return __WEBPACK_IMPORTED_MODULE_1__client__["a" /* elements */].load(org, repo)
      .then(result => {
        this.shadowRoot.querySelector('catalog-entry').element = result;
        this._progress.disable();
      });
  }

  loadOrg(org) {
    this._progress.enable();
    return __WEBPACK_IMPORTED_MODULE_1__client__["a" /* elements */].listByOrg(org)
      .then(result => {
        this.shadowRoot.querySelector('catalog-org').org = result;
        this._progress.disable();
      });
  }

  showListings() {
    this.shadowRoot.querySelector('catalog-entry').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-org').setAttribute('hidden', '');
    this.shadowRoot.querySelector('catalog-listings').removeAttribute('hidden');
  }

  showEntry() {

    if (!this._entryReady) {
      this._progress.removeAttribute('disabled');
    }

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
      let [org, repo] = __WEBPACK_IMPORTED_MODULE_2_lodash_takeRight___default()(path.split('/'), 2);
      history.replaceState({ view: 'element', org: org, repo: repo }, 'repo', `/element/${org}/${repo}`);
    }
  }

  set config(c) {
    this._config = c;
  }

  get _progress() {
    return this.shadowRoot.querySelector('progress-bar');
  }

  connectedCallback() {

    window.onpopstate = (e) => {
      this.updateLayout();
    };

    this.shadowRoot.querySelector('catalog-header').addEventListener('home-click', e => {
      history.pushState({ view: 'home' }, 'home', '/');
      this.updateLayout();
    });

    this.addEventListener(__WEBPACK_IMPORTED_MODULE_3__github_avatar__["b" /* LoadAvatarEvent */].TYPE, (e) => {
      e.setUrl(this._config.avatarUrl.replace(':user', e.user));
    });

    this.addEventListener(__WEBPACK_IMPORTED_MODULE_0__events__["c" /* VIEW_REPO */], (e) => {
      let data = event.detail.element;
      let state = {
        view: 'element',
        org: data.org,
        repo: data.repo
      };
      window.history.pushState(state, 'view element', `/element/${data.org}/${data.repo}`);
      this.updateLayout();
    });

    this.addEventListener(__WEBPACK_IMPORTED_MODULE_0__events__["d" /* VIEW_ORG */], (e) => {
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
/* harmony export (immutable) */ exports["a"] = PieCatalogApp;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class ProgresBar extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host{
          display: block;
        }
        
        :host([disabled]) #progress{
          opacity: 0;
        }

        #progress {
          opacity: 1;
          width: 100%;
          height: 2px;
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
/* harmony export (immutable) */ exports["a"] = ProgresBar;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return boxShadow; });
let boxShadow = `box-shadow: 0 1px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1)), 0 0px 4px 0 var(--shadow-color, hsla(0, 0%, 0%, 0.1));`


/***/ },
/* 11 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(2),
    getRawTag = __webpack_require__(16),
    objectToString = __webpack_require__(17);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ },
/* 14 */
/***/ function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(2);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ },
/* 17 */
/***/ function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(15);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ },
/* 19 */
/***/ function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ },
/* 20 */
/***/ function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(13),
    isObjectLike = __webpack_require__(20);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(14),
    toInteger = __webpack_require__(24);

/**
 * Creates a slice of `array` with `n` elements taken from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.takeRight([1, 2, 3]);
 * // => [3]
 *
 * _.takeRight([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.takeRight([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.takeRight([1, 2, 3], 0);
 * // => []
 */
function takeRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, n < 0 ? 0 : n, length);
}

module.exports = takeRight;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(25);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(23);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(19),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ },
/* 26 */,
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return elements; });
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

/***/ },
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pie_catalog_app__ = __webpack_require__(8);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__listings__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__listing__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__org__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__github_avatar__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pie_brand__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__progress_bar__ = __webpack_require__(9);

customElements.define('pie-catalog-app', __WEBPACK_IMPORTED_MODULE_0__pie_catalog_app__["a" /* default */]);


customElements.define('catalog-listings', __WEBPACK_IMPORTED_MODULE_1__listings__["a" /* default */]);


customElements.define('catalog-listing', __WEBPACK_IMPORTED_MODULE_2__listing__["a" /* default */]);


customElements.define('catalog-header', __WEBPACK_IMPORTED_MODULE_3__header__["a" /* default */]);


customElements.define('catalog-org', __WEBPACK_IMPORTED_MODULE_4__org__["a" /* default */]);


customElements.define('github-avatar', __WEBPACK_IMPORTED_MODULE_5__github_avatar__["a" /* default */]);


customElements.define('pie-brand', __WEBPACK_IMPORTED_MODULE_6__pie_brand__["a" /* default */]);


customElements.define('progress-bar', __WEBPACK_IMPORTED_MODULE_7__progress_bar__["a" /* default */]);

__webpack_require__.e/* require.ensure */(0).then((() => {

  const {define} = __webpack_require__(12);
  define();

  const MarkdownElement = __webpack_require__(32).default;
  customElements.define('markdown-element', MarkdownElement);

  const CatalogEntry = __webpack_require__(27).default;
  customElements.define('catalog-entry', CatalogEntry);
  const { default: DependenciesPanel, DependencyEl } = __webpack_require__(29);
  customElements.define('dependencies-panel', DependenciesPanel);
  customElements.define('dependency-el', DependencyEl);

  const { default: InfoPanel, GithubInfoCount } = __webpack_require__(31);
  customElements.define('info-panel', InfoPanel);
  customElements.define('github-info-count', GithubInfoCount);

  //Note: these elements auto register themselves
  __webpack_require__(26);

  const FancyTabs = __webpack_require__(30).default;
  customElements.define('fancy-tabs', FancyTabs);

  const CatalogSchemas = __webpack_require__(33).default;
  customElements.define('catalog-schemas', CatalogSchemas);

}).bind(null, __webpack_require__)).catch(__webpack_require__.oe).then(() => {
  let app = document.querySelector('pie-catalog-app');
  app.entryReady();
}).catch((e) => {
  let app = document.querySelector('pie-catalog-app');
  app.error(e);
});


document.addEventListener('DOMContentLoaded', () => {
  customElements.whenDefined('pie-catalog-app')
    .then(() => {

      let app = document.querySelector('pie-catalog-app');
      app.config = window['pie-catalog-app-config'];
      setTimeout(function () {
        app.removeAttribute('hidden');
      }, 150);
    });

});


/***/ }
/******/ ]);