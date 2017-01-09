import React from 'react';
import * as _ from 'lodash';
import Listing from './listing';

export default class CatalogListings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      elements: props.elements || []
    }
  }

  render() {
    return <div>
      <div>Listings</div>
      <div className="results">
        !!!
        {_.map(this.props.elements, (e, index) => <Listing key={index} element={e} />)}
      </div>
    </div>;
  }
}