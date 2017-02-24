import { boxShadow, prepareTemplate, applyStyle } from './styles';

const dependencyElTemplate = prepareTemplate(` <label class="name">name</label>@<label class="semver">version</label> `, 'dependency-el');

export class DependencyEl extends HTMLElement {

  constructor() {
    super();
    let sr = applyStyle(this, dependencyElTemplate);
  }

  connectedCallback() {
    let name = this.getAttribute('name');
    let semver = this.getAttribute('semver');
    this.shadowRoot.querySelector('.name').innerHTML = name;
    this.shadowRoot.querySelector('.semver').innerHTML = semver;
  }
}

const panelTemplate = prepareTemplate(`

      <style>
        :host {
          display: block;
          background-color: white;
          padding: 10px;
          ${boxShadow}
        }
        
        dependency-el{
          display: inline-block;
          padding-right: 20px;
          font-size: 13px;
        }

        .holder{
          display: block;
          position: relative;
        }
      </style>
      <label>Dependencies</label>
      <div class="holder"></div>
`, 'dependencies-panel');

export default class DependenciesPanel extends HTMLElement {
  constructor() {
    super();
    let sr = applyStyle(this, panelTemplate);
  }

  set dependencies(d) {
    if (d) {
      let markup = Object.keys(d).map((k) => {
        let val = d[k];
        return `<dependency-el name="${k}" semver="${val}"></dependency-el>`;
      });
      this.shadowRoot.querySelector('.holder').innerHTML = markup.join('\n');
    }
  }
}