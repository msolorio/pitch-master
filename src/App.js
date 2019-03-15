import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="container">here is the app</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appStateProp: state.stateProp
  };
}

export default connect(mapStateToProps)(App);
