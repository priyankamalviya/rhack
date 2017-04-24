import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'react';  // API will fetch redux related stories from hacker news , since it is set to default
const DEFAULT_PAGE = 0;
const DEFAULT_HPP=100;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

/*ES6*/
//const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props){
    super(props);

        this.state ={
          //list,
          result: null,

          searchTerm: DEFAULT_QUERY,
        };

    //bind setSearchTopStories custom method in the constructor
    this.setSearchTopStories = this.setSearchTopStories.bind(this);

    //bind fetchSearchTopStories custom method in the constructor
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    //bind onDismiss class method in the constructor
    this.onDismiss = this.onDismiss.bind(this);

    //bind onSearchChange class method within the constructor
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchSubmit(event){
    const searchTerm = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);

    event.preventDefault();
  }

  setSearchTopStories(result){
    const {hits, page} = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];

    const updatedHits = [...oldHits, ...hits]
    this.setState({result : {hits:updatedHits, page}
    });
  }

  // define the function that uses native fetch API to get data from hacker news API
  fetchSearchTopStories(searchTerm, page){
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
        &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    //call the method that uses fetch API to pull data from hacker news API
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id){
    const isNotId = item => item.objectID !== id;
      const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({result: {...this.state.result, hits: updatedHits }
        });
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }



  render() {

    //object destructuring
    const { searchTerm, result } = this.state;
    //define a page variable that returns current page or starts with 0
    const page = (result && result.page) || 0;
    console.log(this.state);

    if(!result) {return null;}
    return (
      <div className="page">
        <div className="interactions">
        <Search
        onChange={this.onSearchChange}
        onSubmit={this.onSearchSubmit}
        value={searchTerm}>
        Search
        </Search>
        </div>
        {
          result?
          <Table
        list={result.hits}
        onDismiss={this.onDismiss}/>
        : null
      }
      <div className="interactions">
        <Button
        onClick={() => this.fetchSearchTopStories(searchTerm, page+1)}>
        More</Button>
      </div>
      </div>
    );
  }
}


const Search = ({value, onChange, onSubmit, children}) =>
  //const {value, onChange, children} = props;
<form onSubmit={onSubmit}>
    {children}
    <input type="text"
    value={value}
    /* define onChange callback function for the input field to hook synthetic event */
    onChange={onChange}
    />
    <button type="submit">
    {children}
    </button>
    </form>


const Table = ({list, onDismiss} ) =>
      <div className="table">
      {
        list.map(item =>
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
