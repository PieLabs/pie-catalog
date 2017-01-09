import React from 'react';

export default class Listing extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      LISTING ----
      <div>Org {this.props.element.org}</div>
    </div>;
  }
}