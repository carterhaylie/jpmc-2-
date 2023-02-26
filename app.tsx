import React, { Component } from 'react';
import './App.css';
import { DataStreamer } from './DataStreamer';
import { ServerRespond } from './DataStreamer';
import Graph from './Graph';

/**
 * State declaration for <App />
 */
interface IState {
  // Define the properties for the state object here
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component.
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Render the App component.
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Stocks</h1>
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => this.handleStreamToggle()}>
              {this.state.showGraph ? 'Pause Streaming' : 'Start Streaming'}
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Called when the "Start Streaming" button is clicked.
   */
  handleStreamToggle() {
    this.setState({
      showGraph: !this.state.showGraph,
    });

    if (this.state.showGraph) {
      DataStreamer.stop();
    } else {
      DataStreamer.start((data: ServerRespond[]) => {
        this.setState({
          data,
        });
      });
    }
  }
}

export default App;

