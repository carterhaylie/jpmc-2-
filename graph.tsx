import React, { Component } from 'react';
import * as perspective from 'perspective-api';
import './Graph.css';
import { ServerRespond } from './DataStreamer';

interface IProps {
  data: ServerRespond[];
}

interface IState {
  price: number,
  data: ServerRespond[],
  rows: any[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

interface Table {
  update: (data: any[]) => void,
}

class Graph extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      price: 0,
      data: [],
      rows: [],
    };
  }

  componentDidUpdate() {
    const perspectiveElement = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;
    if (perspectiveElement && this.state.rows.length > 0) {
      perspectiveElement.load(this.state.rows);
    }
  }

  static formatData(serverResponds: ServerRespond[]): {timestamp: Date, stockPrices: {[key: string]: number}}[] {
    const priceData: {timestamp: Date, stockPrices: {[key: string]: number}}[] = [];
    let stockPrices: {[key: string]: number} = {};

    for (const serverRespond of serverResponds) {
      const timestamp = new Date(serverRespond.timestamp);
      const key = serverRespond.stock;
      stockPrices[key] = serverRespond.price;

      priceData.push({timestamp, stockPrices});
    }

    return priceData;
  }

  getData() {
    const data = Graph.formatData(this.props.data);
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      rows.push(Object.assign({}, {'index': i}, data[i]['stockPrices']));
    }
    this.setState({
      price: data[data.length - 1].stockPrices['AAPL'],
      data: data,
      rows: rows,
    });
  }

  render() {
    return (
      <div className="Graph">
        <perspective-viewer id="viewer"></perspective-viewer>
        <div className="price">
          <h4>AAPL: {this.state.price}</h4>
        </div>
      </div>
    );
  }
}

export default Graph;
