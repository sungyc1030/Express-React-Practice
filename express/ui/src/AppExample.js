import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
  }

  state = {
    response: '',
    post: '',
    responseToPost: '',
    userList: []
  };

  componentDidMount(){
    this.callApi()
      .then(res => this.setState({response: res.express}))
      .catch(err => console.log(err));
  };

  callApi = async() => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = async e=> {
    e.preventDefault();
    const response = await fetch('api/world',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({post: this.state.post})
    });
    const body = await response.text();

    this.setState({responseToPost: body});
  };

  testDB = async() => {
    const response = await fetch('/api/users');
    const body = await response.json();

    this.setState({userList: body});
  };

  render() {
    return (
      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>*/}
        <p>{this.state.response}</p>
        <form>
          <p>Post to Server:</p>
          <input type="text" value={this.state.post} onChange={e=>this.setState({post: e.target.value})} />
          <button type="button" onClick={this.handleSubmit}>Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
        <input type="button" value="DB테스트" onClick={this.testDB}/>
        {this.state.userList.length > 0  && 
          <ul>
          {this.state.userList.map(function(data, index){
            return (<li>{data.유저ID} : {data.유저이름}</li>)
          })}
          </ul>
        }
      </div>
    );
  }
}

export default App;
