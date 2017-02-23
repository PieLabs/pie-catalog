import { prepareTemplate, applyStyle, noSelect } from '../styles';
/**
 * 
      // position: absolute;
      // left: 0;
      // top: 0;
      // bottom: 0; 
      // right: 0;
 */
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

// display: none;
/**
 * 
    :host{
      flex: 0.2;
      -webkit-flex: 0.2;
      overflow: hidden;
    }
    :host([selected]){
      flex: 1;
      -webkit-flex: 1;
    }
     display: inline-block;
 * 
 */
const tabHtml = ` 
  <style>
  :host{
    overflow: hidden;
    width: 0px;
    display: inline;
    float: left;
    opacity: 0.0;
  }
  :host([selected]){
    opacity: 1.0;
    width: auto;
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

export class CTabTitle extends HTMLElement {
  constructor() {
    super();
    let sr = applyStyle(this, prepareTemplate(`
    <style>
      :host{
        position: relative;
        top: 1px;
        padding: 10px;
        color: #dddddd;
        text-transform: uppercase;
        font-size: 13px;
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
        border-bottom: solid 1px red;
      }
    </style>
    <div><slot></slot></div>
    `, 'c-tab-title'));
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('select-tab', { bubbles: true }));
    });
  }
}