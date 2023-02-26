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
  perspectiveElement: PerspectiveViewerElement | null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      price: 0,
      data: [],
      rows: [],
    };

    this.perspectiveElement = null;
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0];
    this.perspectiveElement = elem as unknown as PerspectiveViewerElement;
    this.perspectiveElement.setAttribute('view', 'y_line');
    this.perspectiveElement.setAttribute('column-pivots', '["stock"]');
    this.perspectiveElement.setAttribute('row-pivots', '["timestamp"]');
    this.perspectiveElement.setAttribute('columns', '["price"]');
  }

  componentDidUpdate() {
    if (this.perspectiveElement && this.state.rows.length > 0) {
      this.perspectiveElement.load(this.state.rows);
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

  getDataFromServer = () => {
    const { data } = this.props;
    const dataFormated = Graph.formatData(data);

    const rows = dataFormated.map((value, index) => {
      return Object.assign({}, {'index': index}, value['stockPrices']);
    });

    this.setState({
      price: dataFormated[dataFormated.length - 1].stockPrices['AAPL'],
      data: dataFormated,
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

