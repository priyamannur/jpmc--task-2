import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */

//Why do we extend HTMLElement??
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  //Render function is not used anywhere? So WTf?
  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    elem.setAttribute('view', 'y_line');
  //Type of graph --> 'view' should be a y_line which is a continuous line graph

    elem.setAttribute('row-pivots','["timestamp"]');
    //The x axis should have time stamp values, like dates, like for different values of timestamps, have the points
    //to be plotted

    elem.setAttribute('column-pivots','["stock"]');
    //Two different categories agains which lines have to be plotted

    elem.setAttribute('columns','["top_ask_price"]');
    //points of which attribute has to be plotted

    elem.setAttribute('aggregates',`{
      "stock" : "distinct count",
      "top_ask_price" : "avg",
      "top_bid_price" : "avg",
      "timestamp" : "distinct count"
  }`);
  //did not understand

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      
      // Add more Perspective configurations here.
      elem.load(this.table);
    }
   
  }

  componentDidUpdate() {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
