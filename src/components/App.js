import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';

import Navigation from './Navigation';
import views from './views';
const {
  RecordVideoView,
  SendVideoView,
  VideoListView
} = views;


export function getCurrentViewComponent(currentView) {
  switch(currentView) {
    case 'recordVideo':
      return <RecordVideoView/>;

    case 'sendVideo':
      return <SendVideoView/>;

    case 'videoListView':
      return <VideoListView/>;

    default:
      return <div>error retreaving view to show</div>;
  }
};

class App extends Component {

  render() {
    return (
      <div className="app">
        <Navigation/>
        <div className="container">
          {getCurrentViewComponent(this.props.currentView)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentView: state.currentView
  };
}

export default connect(mapStateToProps)(App);
