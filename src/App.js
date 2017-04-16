
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

  constructor(props){
    super(props);

    this.state ={
      list,
    };

    //bind onDismiss class method in the constructor
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id){
    function isNotId(item){
      return item.objectID !== id;
    }

    const updatedList = this.state.list.filter(isNotId);
  }

  render() {
    const hello = 'Welcome to React Hacker News App';
    return (
      <div className="App">
        <h1>Welcome to React Page</h1>
        {
          this.state.list.map(item =>
              <div key={item.objectID}>
              <span><a href={item.url} >{item.title}</a></span>
              <span>{item.author}</span>
              <span>{item.points}</span>
              <span><button onClick={() => this.onDismiss(item.objectID)} type="button">Dismiss</button></span>
              </div>
        ) //map function ends

      }
      </div>
    );
  }
}

export default App;
