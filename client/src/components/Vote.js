import React, { Component } from "react";
import { Link } from "react-router-dom";
import Register from './Register';
import authHeader from "../services/auth-header";

const CryptoSystem = require('../copy/cryptosystem');
let crypto = new CryptoSystem();
const chain = require('../copy/trufflechain');

export default class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: null,
      names: null,
      numbers: null,
      electionKey: null,
      candidate: null,
      success: null
    }
  }

  setCandidate(event) {
    this.setState({ candidate: this.state.numbers[event.target.value]});
  }

  onSubmit = async (event) => {
    event.preventDefault();
    let vote = this.state.candidate;
    let encrypted = crypto.encryptVote(this.state.electionKey, vote);
    await chain.saveVote(encrypted, this.state.wallet.address, this.state.wallet.key);
    const authCode = localStorage.getItem('auth-code')
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify({
        code: authCode,
      })
    };
    const serverURL = "http://localhost:3001/voter/authcode/";
    fetch(serverURL, requestOptions)
    .then(() => {
      this.setState({ success: true});
      console.log("removed auth-code")
      localStorage.removeItem('auth-code');
      
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
    if (this.state.names && !this.state.success) {
      choice = (
        <div className="inner">
        <ul className="list-group">
          <form onSubmit={this.onSubmit}>
            {
              (this.state.names).map((name, i) => {
                return (
                  <li className="list-group-item center-block text-center" key={`poll-${i}`}>
                    <input value ={i} onChange={this.setCandidate.bind(this)} type="radio" name="candidate" id={i} />
                    <i className="center-block text-center" aria-hidden="true"> {name} </i>
                  </li>
                )
              })
            }
            <button type="submit" value="Submit" className="btn btn-dark btn-lg btn-block"> Vote</button>
          </form>
        </ul>
        </div>
      )
    }
    else {
      if(this.state.success){
        choice = (
          <div className="container-fluid">
            <h3> Well done, you successfully voted for {this.state.names[this.state.candidate]} </h3>
            <Link className="btn btn-dark btn-lg btn-block" to={"/result"}> Finish </Link>
          </div>
        )
      }
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
