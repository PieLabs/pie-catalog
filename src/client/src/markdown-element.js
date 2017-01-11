import * as marked from 'marked';
import * as highlight from 'highlight.js';
import * as css from 'highlight.js/styles/default.css';

export default class MarkdownElement extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    <style>
    ${css}
    </style>
    <div></div>
    `
      ;
  }

  set markdown(m) {
    this._markdown = m;

    var opts = {
      sanitize: false,
      pedantic: false,
      smartypants: false
    };

    marked.setOptions({
      highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });

    let rendered = marked(m, opts);
    this.shadowRoot.querySelector('div').innerHTML = rendered;
  }
}