 /* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { sortBy } from 'lodash';
import classNames from 'classnames';

const DEFAULT_QUERY = 'react';  // API will fetch redux related stories from hacker news , since it is set to default
const DEFAULT_PAGE = 0;
const DEFAULT_HPP=20;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list,'author'),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const {searchKey, results} = prevState;
  const oldHits = results && results[searchKey] ? results[searchKey].hits: [];

  const updatedHits = [...oldHits, ...hits];
  return {results : {
    ...results,
    [searchKey]: {hits:updatedHits, page}},
    isLoading: false
  };
};

/*ES6*/
//const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props){
    super(props);

        this.state ={
          //list,
          results: null,
          searchKey:'',
          searchTerm: DEFAULT_QUERY,
          isLoading: false,
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

  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse});
  }

  onSearchSubmit(event){
    const searchTerm = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);

    event.preventDefault();
  }

  setSearchTopStories(result){
    const {hits, page} = result;

  /*  this.setState(prevState => {
      const {searchKey, results} = this.state;

    });*/
    this.setState(updateSearchTopStoriesState(hits, page));

  }




  // define the function that uses native fetch API to get data from hacker news API
  fetchSearchTopStories(searchTerm, page){
    this.setState({isLoading: true});
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
        &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  componentDidMount(){
    const {searchTerm} = this.state;

    this.setState({searchKey: searchTerm});
    //call the method that uses fetch API to pull data from hacker news API
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id){
    const {searchKey, results} = this.state;

    const {hits, page} = results[searchKey];

    const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
        this.setState({results: {...results,
              [searchKey]:{hits: updatedHits, page }}
        });
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }



  render() {

    //object destructuring
    const { searchTerm, results, searchKey, isLoading, sortKey, isSortReverse } = this.state;
    //define a page variable that returns current page or starts with 0
    const page = (results && results[searchKey] &&results[searchKey].page) || 0;

    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    console.log(this.state);


    if(!results) {return null;}
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
          <Table
          list={list}
        onDismiss={this.onDismiss}/>

      <div className="interactions">
      <ButtonWithLoading
      isLoading={isLoading}
      onClick={() => this.fetchSearchTopStories(searchKey, page+1)}>
      More
      </ButtonWithLoading>
      </div>
      </div>
    );
  }
}


 const Search = ({value, onChange, onSubmit, children}) =>
  //const {value, onChange, children} = props;
  {
    let input;
    return (
      <form onSubmit={onSubmit}>
          {children}
          <input type="text"
          value={value}
          /* define onChange callback function for the input field to hook synthetic event */
          onChange={onChange}
          ref={(node)=> input = node}
          />
          <button type="submit">
          {children}
          </button>
          </form>
    );
  }


/*class Search extends Component{
  componentDidMount(){
    this.input.focus();
  }
  render(){
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return(
      <form onSubmit={onSubmit}>
          {children}
          <input type="text"
          value={value}
          /* define onChange callback function for the input field to hook synthetic event */
        /*  onChange={onChange}
          ref={(node) => {this.input = node;}}
          />
          <button type="submit">
          {children}
          </button>
          </form>
    );
  }
}*/


/*Table stateless component is a good idea
but right now App component is the only stateful component in our application.
Sort functioanlity is a feature of table and in attempt
 to make this state as close to Table component as possible,
 Table component needs to be make a class component*/


/*const Table = ({list, sortKey, isSortReverse, onSort, onDismiss} ) =>{
  const sortedList =SORTS[sortKey](list);
  const reverseSortedList = isSortReverse?sortedList.reverse():sortedList;

  return(
    <div className="table">
    <div className="table-header">
    <span style={{width: '40%'}}> <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}></Sort></span>
    <span style={{ width: '30%' }}> <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}></Sort></span>
    <span style={{ width: '10%' }}> <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}></Sort></span>
    </div>
    {reverseSortedList.map(item =>
          <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}><a href={item.url} >{item.title}</a></span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '10%' }}>{item.points}</span>
          <span style={{ width: '10%' }}><Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button></span>
          </div>
    ) //map function ends
    }
    </div>
  );

  Table.PropTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  };
} */


class Table extends Component {
  constructor(props){
    super(props);
    this.state = {
      sortKey:'NONE',
      isSortReverse: false,
    };
  //bind onSort class method within the constructor
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse});
  }
  render() {
    const {list,  onDismiss} = this.props;

    const {sortKey, isSortReverse} = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse? sortedList.reverse():sortedList;
    return(
      <div className="table">
      <div className="table-header">
      <span style={{width: '40%'}}> <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}></Sort></span>
      <span style={{ width: '30%' }}> <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}></Sort></span>
      <span style={{ width: '10%' }}> <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}></Sort></span>
      </div>
      {reverseSortedList.map(item =>
            <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}><a href={item.url} >{item.title}</a></span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}><Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button></span>
            </div>
      ) //map function ends
      }
      </div>
    );
  }
}


const Button = ({
  onClick,
  className = '',
  children}) =>   <button onClick={onClick} className={className} type="button">{children}</button>

    const withLoading = (Component) => ({isLoading, ...rest}) => isLoading? <Loading />: <Component {...rest}/>
    const ButtonWithLoading = withLoading(Button);

Button.PropTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

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


/*Add a Loading component*/

const Loading = () => <div><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
<span className="sr-only">Loading...</span></div>

/*Placing HOC */
/*const withFoo = (Component) => (props) => <Component {...props} />*/

const Sort =
({sortKey, activeSortKey, onSort, children}) => {
  const sortClass=classNames('button-inline', {'button-active': sortKey===activeSortKey});

  return (
    <Button onClick={() =>
      onSort(sortKey)} className={sortClass}>
      {children}
      </Button>
  );
}



export default App;

export {Button, Search, Table};
