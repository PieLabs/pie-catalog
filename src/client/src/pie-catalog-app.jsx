import React, { Component, createElement } from 'react';
import { render } from 'react-dom';
import Header from './header';
import Listings from './listings';

export default class PieCatalogApp extends HTMLElement {

  constructor() {
    super();
  }

  set config(c) {
    this._config = c;
    this._render();
  }

  _render() {
    if (this._config) {
      let el = createElement(App, this._config);
      render(el, this);
    } else {
      console.log('this._config is undefined');
    }
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      elements: []
    }
  }

  loadListings() {

    fetch('/api/elements')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({ elements: json })
      })
      .catch(e => {
        console.error(e);
      });
  }

  componentDidMount() {
    this.loadListings();
  }

  render() {
    console.log('this.state.elements: ', this.state.elements);
    return <div>
      This is the app...
      <Header />
      <Listings elements={this.state.elements} />
    </div>;
  }
}