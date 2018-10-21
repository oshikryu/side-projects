import React, { Component } from 'react';
import './App.css';
import ProjectPage from './components/project-page/';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span className="thunk-logo">
          </span>
        </header>
        <ProjectPage />
      </div>
    );
  }
}

export default App;
