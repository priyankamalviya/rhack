// eslint-disable-next-line
/* eslint-disable */
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
        {
          list.map((item) =>
              <div key={item.objectID}>
              <span><a href={item.url} >{item.title}</a></span>
              <span>{item.author}</span>
              <span>{item.points}</span>
              </div>
        ) //map function ends
      }
      </div>
    );
  }
}

export default App;
