import * as marked from 'marked';
import * as highlight from 'highlight.js';
import * as css from 'highlight.js/styles/default.css';
import { applyStyle, prepareTemplate } from './styles';

const templateHTML = `
    <style>
    ${css}
    </style>
    <div></div>
`;

export default class MarkdownElement extends HTMLElement {

  constructor() {
    super();
    const template = prepareTemplate(templateHTML, 'markdown-element');

    let sr = applyStyle(this, template);
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