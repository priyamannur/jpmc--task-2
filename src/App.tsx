import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {

  //New variable added that indicates when a graph should be shown
  showGraph : boolean;

  data: ServerRespond[],
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property

      //Variable initially set to false, as initially we do not want the graph to be shown
      showGraph:false,
      data: [],
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {

    //Renders only when showGraoh var is set to true, that is when the button is pressed
    if(this.state.showGraph)
    return (<Graph data={this.state.data}/>)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x=0;
    const intervalId =setInterval(() => {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      //Including the above factors, we also every time(a new data is fetched) show the graph, so showGraph:true
      //May be there are only 1000 data to be fetched, hence after x becomes 1000, or to say
      //After data is fetched for 1000 times, we stop the interval
      //We stop the loop.
      this.setState({
         data: serverResponds,
      showGraph:true,
     });
    });
    x++;
    if(x>1000)
    clearInterval(intervalId);
  },100);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
