import './App.css';
import Home from './components/Home';
import React from 'react';

function App() {

  const pageStyle = {
    background: '#FFFDD0',
    height: '100vh'
  }

  return (
    <div className="App" style={pageStyle}>
       <Home />
    </div>
  );
}

export default App;
