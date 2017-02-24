import { prepareTemplate, applyStyle, noSelect } from '../styles';

const tabsHtml = ` 
  <style>
    :host{
      position: relative;
    }
    #tab-bar{
      display: flex;
      padding: 0px;
      margin: 0;
      background-color: white;
      width: 100%;
      border-bottom: solid 1px #dddddd;
    }

    ::slotted(c-tab){
      flex-grow: 0.0;
    }

    #content-holder{
      position: relative;
      display: flex;
      flex-direction: row;
      display: -webkit-flex;
      -webkit-flex-direction: row;
      -webkit-box-orient: horizontal;
      margin-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
    }
  </style>
  <div id="tab-bar"></div>
  <div id="content-holder">
    <slot></slot> 
  </div>
`;

export class CTabs extends HTMLElement {
  constructor() {
    super();
    let sr = applyStyle(this, prepareTemplate(tabsHtml, 'c-tabs'));
    this._$tabBar = this.shadowRoot.querySelector('#tab-bar');
  }

  connectedCallback() {
    let tabs = this.querySelectorAll('c-tab');
    let titles = [];
    for (var t of tabs) {
      titles.push(t.getAttribute('title'));
    }

    let toTabTitle = (t) => `<c-tab-title>${t}</c-tab-title>`;

    let titleMarkup = `${titles.map(toTabTitle).join('')}`;
    this._$tabBar.innerHTML = `${titles.map(toTabTitle).join('')}`;

    this._selectedTabIndex = 0;
    this._selectTab(this._selectedTabIndex);

    this._tabTitles.forEach((tt, index) => {
      tt.addEventListener('select-tab', this._selectTab.bind(this, index));
    });
  }

  get _tabTitles() {
    let out = [];
    let titles = this._$tabBar.querySelectorAll('c-tab-title');
    for (var i = 0; i < titles.length; i++) {
      out.push(titles[i]);
    }
    return out;
  }

  _selectTab(index) {
    console.log('selectTab: ', index, this);
    this._selectTabTitle(index);
    this._selectTabContent(index);
  }

  _selectTabTitle(index) {
    let titleTabs = this._$tabBar.querySelectorAll('c-tab-title');
    for (var i = 0; i < titleTabs.length; i++) {
      let selected = index === i;
      let tt = titleTabs[i];
      selected ? tt.setAttribute('selected', '') : tt.removeAttribute('selected');
    }
  }

  _selectTabContent(index) {
    let tabs = this.querySelectorAll('c-tab');
    console.log('tabs: ', tabs);
    for (var i = 0; i < tabs.length; i++) {
      let selected = index === i;
      console.log('selected? ', selected);
      let tt = tabs[i];
      selected ? tt.setAttribute('selected', '') : tt.removeAttribute('selected');
    }
  }
}

const tabHtml = ` 
  <style>
  :host{
    position: relative;
    display: none;
  }
  :host([selected]){
    opacity: 1.0;
    display: block;
  }
  </style>
  <slot></slot>
`;

export class CTab extends HTMLElement {
  constructor() {
    super();
    let sr = applyStyle(this, prepareTemplate(tabHtml, 'c-tab'));
  }
}

const titleTemplate = prepareTemplate(`
    <style>
      :host{
        position: relative;
        top: 1px;
        padding: 10px;
        color: #dddddd;
        text-transform: uppercase;
        font-size: 14px;
        border-bottom: solid 1px #dddddd;
        transition: 200ms border linear, 200ms color linear;
        -webkit-transition:  200ms border linear, 200ms color linear;
        ${noSelect}
        cursor: pointer;
      }

      :host(:hover){
        color: #bbbbbb;
      }

      :host([selected]){
        color: black;
        border-bottom: solid 1px var(--ctab-selected-tab-border, rgba(50, 170, 50, 0.7));
      }
    </style>
    <div><slot></slot></div>
    `, 'c-tab-title');

export class CTabTitle extends HTMLElement {
  constructor() {
    super();
    let sr = applyStyle(this, titleTemplate);
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('select-tab', { bubbles: true }));
    });
  }
}