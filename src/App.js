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


//define higher order function isSearched outside of class Component

/* ES5
function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm);
  }
} */

/*ES6*/
const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props){
    super(props);

        this.state ={
          list,
          searchTerm: ''
        };

    //bind onDismiss class method in the constructor
    this.onDismiss = this.onDismiss.bind(this);

    //bind onSearchChange class method within the constructor
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id){
    function isNotId(item){
      return item.objectID !== id;
    }

    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }



  render() {

    //object destructuring
    const { list, searchTerm } = this.state;
    return (
      <div className="page">
        <div className="interactions">
        <Search
        onChange={this.onSearchChange}
        value={searchTerm}>
        Search
        </Search>
        </div>
        <Table
        list={list}
        pattern={searchTerm}
        onDismiss={this.onDismiss}/>
      </div>
    );
  }
}


const Search = ({value, onChange, children}) =>
  //const {value, onChange, children} = props;

<form>
    {children}
    <input type="text"
    value = {value}
    /* define onChange callback function for the input field to hook synthetic event */
    onChange = {onChange}
    />
    </form>


const Table = ({list, pattern, onDismiss} ) =>
      <div className="table">
      {
        list.filter(isSearched(pattern)).map(item =>
            <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}><a href={item.url} >{item.title}</a></span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}><Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button></span>
            </div>
      ) //map function ends
      }
      </div>

/*class Table extends Component {
  render() {
    const {list, pattern, onDismiss} = this.props;
    return(
      <div>
      {
        list.filter(isSearched(pattern)).map(item =>
            <div key={item.objectID}>
            <span><a href={item.url} >{item.title}</a></span>
            <span>{item.author}</span>
            <span>{item.points}</span>
            <span><Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button></span>
            </div>
      ) //map function ends
    }
      </div>
    )
  }
}
*/

const Button = ({
  onClick,
  className = '',
  children}) =>   <button onClick={onClick} className={className} type="button">{children}</button>


/*class Button extends Component{
  render(){
    const {
      onClick,
      className = '',
      children} = this.props;

    return(
      <button onClick={onClick} className={className} type="button">{children}</button>
    )
  }
} */


export default App;
