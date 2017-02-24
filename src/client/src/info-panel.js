import * as octicons from 'octicons';
import { boxShadow, prepareTemplate, applyStyle } from './styles';

const infoCountTemplate = prepareTemplate(`
      <style>
        :host {
          display: none;
        }
        .icon{
          vertical-align: middle;
          display: inline-table;
        }
      </style>
      <span class="icon"></span>
      <label></label>
`, 'github-info-count');

export class GithubInfoCount extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, infoCountTemplate);
  }

  connectedCallback() {
    let iconKey = this.getAttribute('icon');
    let icon = octicons[iconKey];

    if (icon) {
      this.shadowRoot.querySelector('.icon').innerHTML = icon.toSVG();
    }
  }

  set count(c) {
    if (c !== undefined) {
      this.style.display = 'inline-block';
      this.shadowRoot.querySelector('label').innerHTML = c;
    } else {
      this.style.display = 'none';
    }
  }
}

const infoPanelTemplate = prepareTemplate(`
      <style>
        [hidden]{
          display: none;
        }

        :host {
          display: block;
          margin-top: 10px;
          margin-bottom: 10px;
          padding: 10px;
          background-color: white;
          ${boxShadow}
        }

        github-info-count{
          margin-right: 20px;
        }
        
        .updated{
          font-size: 13px;
          margin-right: 20px;
        }
        
      </style>
      <span class="no-info">No information from github available</span>
      <span class="updated" hidden>Last updated <relative-time> </relative-time></span>
      <github-info-count 
        icon="star" 
        label="stargazers"
        data-key="stargazers_count"></github-info-count>
      <github-info-count 
        icon="eye" 
        label="watchers"
        data-key="watchers_count"></github-info-count>
      <github-info-count 
        icon="repo-forked" 
        label="forks"
        data-key="forks_count"></github-info-count>
      <github-info-count 
        icon="issue-opened" 
        label="open issues"
        data-key="open_issues_count"></github-info-count>
`, 'info-panel');

export default class InfoPanel extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, infoPanelTemplate);
  }

  set github(g) {

    if (!g) {
      g = {};
    }

    this._github = g;
    this.shadowRoot.querySelectorAll('github-info-count').forEach((n) => {
      let key = n.getAttribute('data-key');
      if (key) {
        n.count = g[key];
      }
    });

    if (g.pushed_at) {
      this.shadowRoot.querySelector('relative-time').setAttribute('datetime', g.pushed_at);
      this.shadowRoot.querySelector('.updated').removeAttribute('hidden');
      this.shadowRoot.querySelector('.no-info').setAttribute('hidden', '');
    } else {
      this.shadowRoot.querySelector('.updated').setAttribute('hidden', '');
      this.shadowRoot.querySelector('.no-info').removeAttribute('hidden');
    }
  }
}