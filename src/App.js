import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var request = require('request');



class App extends Component {

  constructor(props) {
  super(props);

  this.state = {
  };
}

  render() {


    request('https://www.reddit.com/r/food.json', function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.


      });





    return (

      <div className="App">

      <div>
          <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519925307/concordia/5.jpg" />
      </div>

        <div>
            <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519925300/concordia/4.jpg" />
        </div>

        <div>
            <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519925301/concordia/2.jpg" />
        </div>

        <div>
            <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519925298/concordia/3.jpg" />
        </div>


        <div>
            <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519925305/concordia/8.jpg" />
        </div>


        <div>
          <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519925305/concordia/6.jpg" />
        </div>


        <div>
          <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519877069/concordia/ijm0ogbz1ri01.jpg" />
        </div>


        <div>
          <img src="https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1519877069/concordia/mjqikhbq8zi01.jpg" />
        </div>




      </div>
    );
  }
}

export default App;
