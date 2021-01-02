import React, { Component } from "react";
import { Link } from "react-router-dom";
import Register from './register';
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);

export default class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: null,
      numbers: null,
      electionKey: null,
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
    };
    const serverURL = "http://localhost:3001/voter/register/";
    fetch(serverURL, requestOptions)
        .then(result => result.json())
        .then(result => {
            this.setState({
                sessionToken: result
            })
        });
}

  componentDidMount() {
    const savedWallet = JSON.parse(localStorage.getItem('myGreatWallet'));
    this.setState({ wallet: savedWallet });

    const serverURL = "http://localhost:3001/voter/data/";
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(serverURL, requestOptions)
      .then(result => result.json())
      .then(result => {
        console.log(result);
        const names = result.names;
        const numbers = result.numbers;
        const electionKey = result.electionKey;
        this.setState({
          names: names,
          numbers: numbers,
          electionKey: electionKey
        })
      });
  }

  render() {
    let choice = '';
    if (this.state.names) {
      choice = (
        <ul className="list-group">
          <form onSubmit={this.onSubmit}>
            {
              (this.state.names).map((name, i) => {
                return (
                  <li className="list-group-item center-block text-center" key={`poll-${i}`}>
                    <input type="radio" name="candidate" id={i} />
                    <i className="center-block text-center" aria-hidden="true"> {name} </i>
                  </li>
                )
              })
            }
            <button type="submit" value="Submit" className="btn btn-dark btn-lg btn-block"> Vote</button>
          </form>
        </ul>
      )
    }
    if (this.state.wallet) {
      return (
        <div className="container-fluid">
          <h3> You are ready to vote!</h3>
          <div className="panel">
            <h5 className="center-block text-center"> Address : {this.state.wallet.address.substring(0, 6)} ... </h5>
            <h5 className="center-block text-center"> Key : {this.state.wallet.key.substring(0, 6)} ... </h5>
          </div>
          {choice}

        </div>
      );
    }
    return (<Register/>);
  }
};