import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react',
    author: 'Jordan Walke',
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://facebook.github.io/reactjs/redux',
    author: 'Dan Abramov',
    points: 5,
    objectID: 1,
  }
];

class App extends Component {
  render() {
    const hello = 'Welcome to React Hacker News App';
    return (
      <div className="App">
        <h1>Welcome to React Page</h1>
        {list.map(function(item){
            return <p>{item.title}</p> ;
          })}
      </div>
    );
  }
}

export default App;
