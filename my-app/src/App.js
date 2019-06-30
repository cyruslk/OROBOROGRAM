import React, { Component } from 'react';
import './App.css';
import {encode, decode} from 'node-base64-image'; // ES6




class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    };
  }

  componentDidMount() {
    fetch('http://localhost:5000/main-data')
      .then(res => res.json())
      .then(data => this.setState({ data }))
  }

  displayImage = () => {
    if(this.state.data){
      const data = this.state.data;
      console.log(data[0].originalImage);
      const img = data[0].originalImage
    }
  }

  render() {
    this.displayImage()
    return(
      <div>
      </div>
    )
  }
}

export default App;
