import React, { Component } from "react";
import { Link } from "react-router-dom";
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);

export default class Key extends Component {
  constructor(props) {
    super(props);
    const { savedToken } = props;
    console.log(savedToken);
    this.state = {
      sessionToken: savedToken,
      wallet: null,
      success: null
    }
  }

  onGenerate = (event) => {
    event.preventDefault();
    const address = this.state.wallet.address;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${this.state.sessionToken}` },
        body: JSON.stringify({
            pubKey: address
        })
    };
    const serverURL = "http://localhost:3001/voter/keysave/";
    fetch(serverURL, requestOptions)
        .then(result => {
          this.setState({ success: result });
          localStorage.setItem('myGreatWallet', JSON.stringify(this.state.wallet));
        });
}

  async componentDidMount() {
    const account = await web3.eth.accounts.create();
    const wallet = { address: account.address, key: account.privateKey };
    this.setState({ success: null, wallet: wallet });
  }

  render() {
    if (this.state.success) {
      return (
        <div>
          <h3> Well done! Here is your address and private key!</h3>
          <h3> Address : {this.state.wallet.address.substring(0,6)} ... </h3>
          <h3> Key : {this.state.wallet.key.substring(0,6)} ... </h3>
          <Link className="btn btn-dark btn-lg btn-block" to={"/vote"}>Vote</Link>
        </div>
      );
    }
    return (
      <form onSubmit={this.onGenerate}>
        <div>
          <h3>Almost there!</h3>
        </div>
        <button className="btn btn-dark btn-lg btn-block"> Sign up for elections!</button>
      </form>
    );
  }
};