import * as octicons from 'octicons';
import * as styles from './styles';

export class GithubInfoCount extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        .icon{
          vertical-align: middle;
          display: inline-table;
        }
      </style>
      <span class="icon"></span>
      <label></label>
    `;
  }

  set icon(i) {
  }

  connectedCallback() {
    let iconKey = this.getAttribute('icon');
    let icon = octicons[iconKey];

    if (icon) {
      this.shadowRoot.querySelector('.icon').innerHTML = icon.toSVG();
    }
  }

  set count(c) {
    this.shadowRoot.querySelector('label').innerHTML = c;
  }
}

export default class InfoPanel extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: 10px;
          margin-bottom: 10px;
          padding: 10px;
          background-color: white;
          ${styles.boxShadow}
        }
        github-info-count{
          margin-right: 20px;
        }
        
        .updated{
          font-size: 13px;
          margin-right: 20px;
        }
        
      </style>
      <span class="updated"> Last updated <relative-time> </relative-time></span>
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
    `;
  }

  set github(g) {
    this._github = g;
    this.shadowRoot.querySelectorAll('github-info-count').forEach((n) => {
      let key = n.getAttribute('data-key');
      if (key) {
        n.count = g[key];
      }
    });

    this.shadowRoot.querySelector('relative-time').setAttribute('datetime', g.pushed_at);
  }
}